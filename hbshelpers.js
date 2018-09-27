const handlebars = require('hbs');
handlebars.registerHelper('dateFormat', require('handlebars-dateformat'));

handlebars.registerHelper('trimString', (passedString, start, end) => {
    const theString = passedString.substring(start, end);
    return new handlebars.SafeString(theString)
});

handlebars.registerHelper('concat', (...args) => args.slice(0, -1).join(''));
