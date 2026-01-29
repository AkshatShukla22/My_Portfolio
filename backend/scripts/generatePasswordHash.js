import bcrypt from 'bcryptjs';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const generatePasswordHash = async () => {
  rl.question('Enter the admin password you want to set: ', async (password) => {
    if (password.length < 6) {
      console.log('\n❌ Password must be at least 6 characters long');
      rl.close();
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      
      console.log('\n✅ Password hash generated successfully!');
      console.log('\n📋 Add this to your .env file:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`ADMIN_PASSWORD=${hashedPassword}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      
    } catch (error) {
      console.error('❌ Error generating hash:', error);
    }
    
    rl.close();
  });
};

generatePasswordHash();