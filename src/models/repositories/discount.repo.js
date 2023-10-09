'use strict'

const { getSelectData, getUnSelectData } = require("../../utils");

const findAllDiscountCodesUnselect = async({
    limit = 50, page = 1, sort = 'ctime',
    filter, unSelect, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const data = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getUnSelectData(unSelect))
        .lean()
    
    return data
}

const findAllDiscountCodesSelect = async({
    limit = 50, page = 1, sort = 'ctime',
    filter, select, model
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const data = await model.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    
    return data
}

const checkDiscountExists = async ({model, filter}) => {
     // create index for discount code
     console.log(`[1]::`, filter);
     return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodesUnselect,
    findAllDiscountCodesSelect,
    checkDiscountExists
}