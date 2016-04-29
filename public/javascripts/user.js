function User(name, roomId, socketId) {  
  this.name = name;
  this.roomId = roomId;
  this.socketId = socketId || null;
  this.status = "available";
};

// Room.prototype.addPerson = function(personID) {  
//   if (this.status === "available") {
//     this.people.push(personID);
//   }
// };

module.exports = User;  