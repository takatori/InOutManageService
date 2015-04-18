module.exports = {
    db: {
        production : "mongodb://localhost/InOutManageService",
        development: "mongodb://localhost/InOutManageService",
        test       : "mongodb://localhost/InOutManageService"
    },
    users: {
        url: {
            production : "http://inserv:3001",
            development: "http://localhost:3001",
            test       : "http://localhost:3001"
        },
        apis: {
            current : "/apis/users/current"
        }
    },
    "fluentd": {		
        "server": {		
            "ip": "192.168.0.23",		
            "port": "24224"		
        },		
        "options": {		
            "timeout": 3.0		
        }
    }
};
