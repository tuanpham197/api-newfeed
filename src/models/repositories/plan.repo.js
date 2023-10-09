'use strict'

const { Types } = require('mongoose')
const { plan, community, pro} = require('../plan.model');
const { getSelectData, getUnSelectData, convertToObjectIdMongoDb } = require('../../utils');


const findAllPlans = async ({limit, sort , page, filter, select}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    console.log(`[1]::`, getSelectData(select));
    const plans = await plan.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(select))
        .lean()
    
    return plans
}

const findPlan = async ({plan_id, unSelect}) => {
    return await plan.findById(plan_id)
        .select(getUnSelectData(unSelect))
        .lean()
}

const updatePlanById = async ({
    plan_id,
    payload,
    model,
    isNew = true
}) => {
    return await model.findByIdAndUpdate(plan_id, payload, {
        new: isNew
    })
}


const findAllPlanDraft = async ({query, limit, skip}) => {
    return await queryPlan({query, limit, skip})
}

const findAllPlanPublish = async ({query, limit, skip}) => {
    return await queryPlan({query, limit, skip})
}

const publishPlanByOwner = async ({plan_owner, plan_id})=> {
    const foundOwner = await plan.findOne({
        plan_owner: new Types.ObjectId(plan_owner),
        _id: new Types.ObjectId(plan_id)
    })
    if (!foundOwner) return null

    foundOwner.isDraft = false
    foundOwner.isPublished = true

    const {modifiedCount} = await foundOwner.updateOne(foundOwner)
    return modifiedCount
}

const unPublishPlanByOwner = async ({plan_owner, plan_id})=> {
    const foundOwner = await plan.findOne({
        plan_owner: new Types.ObjectId(plan_owner),
        _id: new Types.ObjectId(plan_id)
    })
    if (!foundOwner) return null

    foundOwner.isDraft = true
    foundOwner.isPublished = false

    const {modifiedCount} = await foundOwner.updateOne(foundOwner)
    return modifiedCount
}

const searchPlans = async ({keySearch}) => {
    const regexSearch = new RegExp(keySearch)
    const result= await plan.find({
        isPublished: true,
        $text: {$search: regexSearch}
    }, {
        score: {$meta: 'textScore'}
    })
    .sort({score: {$meta: 'textScore'}})
    .lean()
    return result
}

const queryPlan = async ({query, limit, skip}) => {
    return await plan.find(query)
        .populate('plan_owner', 'name email -_id')
        .sort({updatedAt: -1})
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

const getPlanById = async(planId) => {
    return await plan.findOne({_id: convertToObjectIdMongoDb(planId)}).lean()
}

const checkPlanByServer = async (plans) => {
    return await Promise.all(plans.map(async plan => {
        const foundPlan = await getPlanById(plan.planId)
        if (foundPlan) {
            return {
                price: foundPlan.plan_price,
                quantity: plan.quantity,
                planId: plan.planId
            }
        }
    }))
} 

module.exports = {
    findAllPlanDraft,
    publishPlanByOwner,
    findAllPlanPublish,
    unPublishPlanByOwner,
    searchPlans,
    findAllPlans,
    findPlan,
    updatePlanById,
    getPlanById,
    checkPlanByServer
}