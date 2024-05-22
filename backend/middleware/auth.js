import jwt from 'jsonwebtoken';

const authMiddleware = async (req,res,next) => {
    const {token} = req.headers;
    if(!token){
        return res.json({success:false, message:"Not Authorized Login Again"});
    }
    try {
        const token_decode = jwt.verify(token,process.env.JWT_SECRECT);

        // //Kiểm tra thời gian của token và tạo token mới nếu sắp hết hạn
        // const currentTime = Math.floor(Date.now()/1000);

        req.body.userId = token_decode.id;
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false, message:" Error"});
    }
}

export default authMiddleware;