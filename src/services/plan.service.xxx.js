'use strict'

const { BadRequestError } = require('../core/error.response')
const {community, pro, plan} = require('../models/plan.model')
const { insertInventory } = require('../models/repositories/inventory.repo')
const { findAllPlanDraft, publishPlanByOwner, findAllPlanPublish, unPublishPlanByOwner, searchPlans, findAllPlans, findPlan, updatePlanById } = require('../models/repositories/plan.repo')
const { removeNonValueField, updateNestedObjectParser } = require('../utils')

// define Factory class create product

class PlanFactory {
    /**
     * type: 'Community'
     * payload
     */
    static planRegistry = {} //key-class

    static registerPlanType(type, classRef) {
        PlanFactory.planRegistry[type] = classRef
    }


    static async createPlan(type, payload) {
        const planClass = PlanFactory.planRegistry[type]
        if (!planClass) throw new BadRequestError(`Invalid plan type ${type}`)

        return new planClass(payload).createPlan()
    }

    static async updatePlan(type, plan_id, payload) {
        const planClass = PlanFactory.planRegistry[type]
        if (!planClass) throw new BadRequestError(`Invalid plan type ${type}`)

        return new planClass(payload).updatePlan(plan_id)
    }

    

    // PUT
    static async publishPlanByOwner({plan_owner, plan_id}) {
        return await publishPlanByOwner({plan_owner, plan_id})
    }

    static async unPublishPlanByOwner({plan_owner, plan_id}) {
        return await unPublishPlanByOwner({plan_owner, plan_id})
    }

    /// QUERY
    static async findAllPlanDraft({plan_owner, limit = 50, skip = 0}) {
        const query = {plan_owner, isDraft: true}
        return await findAllPlanDraft({query, limit, skip})
    }

    static async findAllPlanPublish({plan_owner, limit = 50, skip = 0}) {
        const query = {plan_owner, isPublished: true}
        return await findAllPlanPublish({query, limit, skip})
    }

    static async searchPlans({keySearch}) {
        return await searchPlans({keySearch})
    }

    static async findAllPlans({limit = 50, sort = 'ctime', page = 1, filter = {isPublished: true}}) {
        return await findAllPlans({limit, sort, filter, page, select: [
            'plan_name',
            'plan_price',
            'plan_thumb'
        ]})
    }

    static async findPlan({plan_id}) {
        return await findPlan({plan_id, unSelect: ['__v']})
    }

}

// define base plan class

class Plan {
    constructor({
        plan_name, plan_thumb, plan_description, plan_price, plan_type, plan_owner, plan_attributes, plan_quantity
    }) {
        this.plan_name = plan_name
        this.plan_thumb = plan_thumb
        this.plan_description = plan_description
        this.plan_price = plan_price
        this.plan_type = plan_type
        this.plan_owner = plan_owner
        this.plan_attributes = plan_attributes
        this.plan_quantity = plan_quantity
    }

    async createPlan(plan_id) {
        const newPlan = await plan.create({...this, _id: plan_id})

        if (newPlan) {
            await insertInventory({
                planId: newPlan._id,
                userId: this.plan_owner,
                stock: this.plan_quantity
            })
        }
        return newPlan
    }

    // update Plan
    async updatePlan(plan_id, payload) {
        return await updatePlanById({plan_id, payload, model: plan})
    }
}

class Community extends Plan {
    async createPlan() {
        const newCommunity = await community.create(this.plan_attributes)
        if (!newCommunity) throw new BadRequestError('create new community error')

        const newPlan = await super.createPlan()
        if (!newPlan) throw new BadRequestError('create new plan error')

        return newPlan
    }

    async updatePlan(plan_id) {
        /**
         * {
         *  a: null
         * }
         */
        // 1. remove attr has null or undefined
        const objectParams = this
        // 2. check xem update o cho nao
        console.log("DATA", objectParams);
        if (objectParams.plan_attributes) {
            // update child
            await updatePlanById({plan_id, objectParams, model: community})
        }

        const updateProduct = await super.updatePlan(plan_id, objectParams)
        return updateProduct
    }
}

class Pro extends Plan {
    async createPlan() {
        console.log(this.plan_attributes);
        const newPro = await pro.create(this.plan_attributes)
        if (!newPro) throw new BadRequestError('create new pro error')

        const newPlan = await super.createPlan(newPro._id)
        if (!newPlan) throw new BadRequestError('create new plan error')

        return newPlan
    }

    async updatePlan(plan_id) {
        /**
         * {
         *  a: null
         * }
         */
        // 1. remove attr has null or undefined
        const objectParams = removeNonValueField(this)
        // 2. check xem update o cho nao
        if (objectParams.plan_attributes) {
            // update child
            console.log(`[4]:`, objectParams);
            await updatePlanById({
                plan_id,
                payload: updateNestedObjectParser(objectParams.plan_attributes),
                model: pro
            })
        }
        const updateProduct = await super.updatePlan(plan_id, updateNestedObjectParser(objectParams))
        return updateProduct
    }
}

// register plan type
PlanFactory.registerPlanType('pro', Pro)
PlanFactory.registerPlanType('community', Community)

module.exports = PlanFactory