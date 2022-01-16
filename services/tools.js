var type_colors = {
    normal:  '\x1b[37m',
    good:    '\x1b[32m',
    info:    '\x1b[36m',
    other:   '\x1b[35m',
    warning: '\x1b[33m',
    error:   '\x1b[31m',
};

function log(type, data){
    if(type in type_colors){
        const date_time = new Date();
        const time = date_time.toLocaleTimeString();
        
        var space_string = '';
        for(var i = 0; i < 8 - type.length; i++){
            space_string += ' ';
        }

        console.log(type_colors[type], '\x1b[1m', `[${time}] [${type.toUpperCase()}] ${space_string}`, '\x1b[0m', `${data}`);
    }
    
    return;
}
exports.log = log;