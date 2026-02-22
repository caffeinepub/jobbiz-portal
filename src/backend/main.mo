import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Array "mo:core/Array";

actor {
  // Approval Status Types
  public type ApprovalStatus = {
    #pending;
    #approved : Time.Time;
    #rejected : {
      timestamp : Time.Time;
      reason : Text;
    };
  };

  // Employee Types
  public type Employee = {
    id : Text;
    name : Text;
    contact : Text;
    experience : Text;
    skills : Text;
    education : Text;
    approvalStatus : ApprovalStatus;
  };

  // Employer Types
  public type Employer = {
    id : Text;
    companyName : Text;
    industry : Text;
    size : Text;
    website : Text;
    description : Text;
    contact : Text;
    approvalStatus : ApprovalStatus;
  };

  // Business Listing Types
  public type Business = {
    id : Text;
    name : Text;
    category : Text;
    description : Text;
    contact : Text;
    location : Text;
    approvalStatus : ApprovalStatus;
  };

  // User Profile Type
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let employees = Map.empty<Text, Employee>();
  let employers = Map.empty<Text, Employer>();
  let businesses = Map.empty<Text, Business>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Employee Registration
  public shared ({ caller }) func registerEmployee(id : Text, name : Text, contact : Text, experience : Text, skills : Text, education : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as employees");
    };
    let newEmployee : Employee = {
      id;
      name;
      contact;
      experience;
      skills;
      education;
      approvalStatus = #pending;
    };
    employees.add(id, newEmployee);
  };

  // Employer Registration
  public shared ({ caller }) func registerEmployer(id : Text, companyName : Text, industry : Text, size : Text, website : Text, description : Text, contact : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can register as employers");
    };
    let newEmployer : Employer = {
      id;
      companyName;
      industry;
      size;
      website;
      description;
      contact;
      approvalStatus = #pending;
    };
    employers.add(id, newEmployer);
  };

  // Business Listing
  public shared ({ caller }) func listBusiness(id : Text, name : Text, category : Text, description : Text, contact : Text, location : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can list businesses");
    };
    let newBusiness : Business = {
      id;
      name;
      category;
      description;
      contact;
      location;
      approvalStatus = #pending;
    };
    businesses.add(id, newBusiness);
  };

  // Admin Approval Functions
  public shared ({ caller }) func approveEmployee(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can approve employees");
    };
    switch (employees.get(id)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?employee) {
        let updatedEmployee = {
          employee with
          approvalStatus = #approved(Time.now());
        };
        employees.add(id, updatedEmployee);
      };
    };
  };

  public shared ({ caller }) func approveEmployer(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can approve employers");
    };
    switch (employers.get(id)) {
      case (null) { Runtime.trap("Employer not found") };
      case (?employer) {
        let updatedEmployer = {
          employer with
          approvalStatus = #approved(Time.now());
        };
        employers.add(id, updatedEmployer);
      };
    };
  };

  public shared ({ caller }) func approveBusiness(id : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can approve businesses");
    };
    switch (businesses.get(id)) {
      case (null) { Runtime.trap("Business not found") };
      case (?business) {
        let updatedBusiness = {
          business with
          approvalStatus = #approved(Time.now());
        };
        businesses.add(id, updatedBusiness);
      };
    };
  };

  // Admin Rejection Functions
  public shared ({ caller }) func rejectEmployee(id : Text, reason : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can reject employees");
    };
    switch (employees.get(id)) {
      case (null) { Runtime.trap("Employee not found") };
      case (?employee) {
        let updatedEmployee = {
          employee with
          approvalStatus = #rejected({
            timestamp = Time.now();
            reason;
          });
        };
        employees.add(id, updatedEmployee);
      };
    };
  };

  public shared ({ caller }) func rejectEmployer(id : Text, reason : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can reject employers");
    };
    switch (employers.get(id)) {
      case (null) { Runtime.trap("Employer not found") };
      case (?employer) {
        let updatedEmployer = {
          employer with
          approvalStatus = #rejected({
            timestamp = Time.now();
            reason;
          });
        };
        employers.add(id, updatedEmployer);
      };
    };
  };

  public shared ({ caller }) func rejectBusiness(id : Text, reason : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can reject businesses");
    };
    switch (businesses.get(id)) {
      case (null) { Runtime.trap("Business not found") };
      case (?business) {
        let updatedBusiness = {
          business with
          approvalStatus = #rejected({
            timestamp = Time.now();
            reason;
          });
        };
        businesses.add(id, updatedBusiness);
      };
    };
  };

  // Helper function to check if approved
  private func isApproved(status : ApprovalStatus) : Bool {
    switch (status) {
      case (#approved(_)) { true };
      case (_) { false };
    };
  };

  // Query Functions - Filtered by approval status for non-admins
  public query ({ caller }) func getEmployee(id : Text) : async ?Employee {
    switch (employees.get(id)) {
      case (null) { null };
      case (?employee) {
        if (AccessControl.isAdmin(accessControlState, caller) or isApproved(employee.approvalStatus)) {
          ?employee;
        } else {
          null;
        };
      };
    };
  };

  public query ({ caller }) func getEmployer(id : Text) : async ?Employer {
    switch (employers.get(id)) {
      case (null) { null };
      case (?employer) {
        if (AccessControl.isAdmin(accessControlState, caller) or isApproved(employer.approvalStatus)) {
          ?employer;
        } else {
          null;
        };
      };
    };
  };

  public query ({ caller }) func getBusiness(id : Text) : async ?Business {
    switch (businesses.get(id)) {
      case (null) { null };
      case (?business) {
        if (AccessControl.isAdmin(accessControlState, caller) or isApproved(business.approvalStatus)) {
          ?business;
        } else {
          null;
        };
      };
    };
  };

  public query ({ caller }) func getAllEmployees() : async [Employee] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let allEmployees = employees.values().toArray();
    if (isAdmin) {
      allEmployees;
    } else {
      allEmployees.filter<Employee>(func(e) { isApproved(e.approvalStatus) });
    };
  };

  public query ({ caller }) func getAllEmployers() : async [Employer] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let allEmployers = employers.values().toArray();
    if (isAdmin) {
      allEmployers;
    } else {
      allEmployers.filter<Employer>(func(e) { isApproved(e.approvalStatus) });
    };
  };

  public query ({ caller }) func getAllBusinesses() : async [Business] {
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    let allBusinesses = businesses.values().toArray();
    if (isAdmin) {
      allBusinesses;
    } else {
      allBusinesses.filter<Business>(func(b) { isApproved(b.approvalStatus) });
    };
  };
};
