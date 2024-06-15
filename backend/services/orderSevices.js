import orderModel from "../models/orderModel.js";

const paginationOrder = async(page, limit) => {
    try {
        let offset = (page - 1) * limit;

        const count = await orderModel.countDocuments();

        const rows = await orderModel.find()
            .skip(offset)
            .limit(limit);
        let totalPages = Math.ceil(count / limit);

        let data = {
            totalRows: count,
            totalPages: totalPages,
            orders: rows
        };
        return data;
    } catch (error) {
        console.log(error);
    }
}

export {paginationOrder};