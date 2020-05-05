const AccessControl = require("accesscontrol");

const registered = {
    user: {
        'read:any': ['*']
    },
    course: {
        'read:any': ['*']
    },
    author: {
        'read:any': ['*']
    }
}

const admin = {
    user: {
        ...registered.user,
        'create:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    },
    course: {
        ...registered.course,
        'create:any': ['*'],
        'update:any': ['*'],
        'delete:any': ['*']
    }
}

const grantsObject = {
    admin,
    registered,
};

module.exports = new AccessControl(grantsObject);