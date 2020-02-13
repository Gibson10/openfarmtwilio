
const models= require('../models')
const users = models.users;

/*insert query*/
exports.createuser = (objectToSave, callback) => {
    users.create(objectToSave, callback);
}
exports.findusers = (type, findObj, callback) => {
    if(type === 1){
      users.findOne(findObj, callback);
    }else {
      users.find(findObj, callback)
    }
}

exports.updateUser = (matchObj, updateObj, options, callback) => {
  users.findOneAndUpdate(matchObj, { $set: updateObj }, options, callback);
}


exports.addToSet = (matchObj, updateObj, options, callback) => {
  users.findOneAndUpdate(matchObj, { $addToSet: updateObj }, options, callback);
}

exports.removeFromSet = (matchObj, updateObj, options, callback) => {
  users.findOneAndUpdate(matchObj, { $pull: updateObj }, options, callback);
}


exports.deteteDoc = (matchObj, callback) =>{
  users.deleteOne(matchObj, callback);
}