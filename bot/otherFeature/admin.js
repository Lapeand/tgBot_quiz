const ADMINS = ['1054974691', '1592910570']; 

function isAdmin(userId){
  return ADMINS.includes(userId);
}

module.exports = isAdmin;