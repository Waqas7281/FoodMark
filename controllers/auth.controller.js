const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const genToken = require('../utils/token');
const sendMail = require('../utils/mail');

const signup = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, role } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
        if (phoneNumber.length !== 11) {
            return res.status(400).json({ message: 'Phone number must be 11 characters long' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            email,
            role,
            phoneNumber,
            password: hashedPassword,
        });
        const token = genToken(user._id);
        res.cookie('token', token, {
            secure: false,
            sameSite: "strict",
            maxAge: 7*24*60*60*1000, // 7 days
            httpOnly: true,
        });
        return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Sign up error: ${error.message}` });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = genToken(user._id);
        res.cookie("token", token, {
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          httpOnly: true,
        });
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ message: `Sign in error: ${error.message}` });
    }
};

const signOut = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: 'Sign out successful' });
    } catch (error) {
        return res.status(500).json({ message: `Sign out error: ${error.message}` });
    }
};

const sendOtp = async (req, res) => {
    // Implementation for sending OTP
    try{
        const { email } = req.body;
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: "User does not exist" });
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp;
        user.otpExpiryTime = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
        user.isOtpVerified = false;
        await user.save();
        // await sendMail if it returns a promise; pass the otp variable
        await sendMail(email, otp);
        return res.status(200).json({ message: "OTP sent to email" });
    } catch(error){
        console.error("Send OTP error:", error);
        return res.status(500).json({ message: `Send OTP error: ${error.message}` });
    }
}

const verifyOtp= async (req,res)=>{
    try{
        const {email ,otp} = req.body;
        const user = await User.findOne({ email});
        if(!user || user.resetOtp !== otp || user.otpExpiryTime < Date.now()){
            return res.status(400).json({ message: "Invalid OTP" });
        }
        user.isOtpVerified = true;
        user.otpExpiryTime = undefined;
        await user.save();
        return res.status(200).json({ message: "OTP verified successfully" });
    }
    catch(error){
        return res.status(500).json({ message: `Verify OTP error: ${error.message}` });
    }
}


const resetPassword = async (req,res)=>{
    try{
        const { email, newPassword, confirmPassword} = req.body;
        const user = await User.findOne({ email});
        // require that OTP was verified before allowing reset
        if(!user || !user.isOtpVerified){
            return res.status(400).json({ message: "User does not exist or OTP not verified" });
        }
        if(!newPassword || newPassword !== confirmPassword){
            return res.status(400).json({ message: "Passwords do not match" });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        user.resetOtp = undefined;
        user.otpExpiryTime = undefined;
        await user.save();
        return res.status(200).json({ message: "Password reset successfully" });

    }
    catch(error){
        return res.status(500).json({ message: `Reset Password error: ${error.message}` });
    }
}

const getData = async (req, res) => {
    try {
        const data = [
            {
                id: 1,
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                role: 'user',
                phoneNumber: '01234567890',
            },
            {
                id: 2,
                fullName: 'Jane Smith',
                email: 'jane.smith@example.com',
                role: 'admin',
                phoneNumber: '09876543210',
            },
        ];
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: `Get data error: ${error.message}` });
    }
};






module.exports = {
  signup,
  signIn,
  signOut,
  sendOtp,
  verifyOtp,
  resetPassword,
  getData,
};
