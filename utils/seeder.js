const User = require('../models/user');



const accountSeeder = async () => {
    const data = await User.find({}).exec();
    if (data.length !== 0) {
        // Data exists, no need to seed.
        // console.log('Data exists, no need to seed.');
        return;
    }
    
    const username = 'admin';
    const password = '12345';

    await User.create({
        username, password
    });

    // console.log('Data seeded successfully!');
}

module.exports = accountSeeder;