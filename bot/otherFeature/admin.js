const ADMINS = [1054974691]; 

function isAdmin(userId){
  return ADMINS.includes(userId);
}

module.exports = isAdmin;