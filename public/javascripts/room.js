function Room(name, owner, resType, neighbourhood) {  
  this.name = name;
  this.owner = owner;
  this.people = {};
  this.resType = resType;
  this.neighbourhood = neighbourhood;
  this.status = "available";
};


module.exports = Room;  