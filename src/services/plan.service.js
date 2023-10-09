'use strict'

const { BadRequestError } = require('../core/error.response')
const {community, pro, plan} = require('../models/plan.model')

// define Factory class create product

class PlanFactory {
    /**
     * type: 'Community'
     * payload
     */
    static async createPlan(type, payload) {
        switch (type) {
            case 'community':
                return new Community(payload)
            case 'pro':
                return new Pro(payload).createPlan()
            default:
                throw new BadRequestError(`Invalid plan type ${type}`)
        }
    }
}

// define base plan class

class Plan {
    constructor({
        plan_name, plan_thumb, plan_description, plan_price, plan_type, plan_owner, plan_attributes
    }) {
        this.plan_name = plan_name
        this.plan_thumb = plan_thumb
        this.plan_description = plan_description
        this.plan_price = plan_price
        this.plan_type = plan_type
        this.plan_owner = plan_owner
        this.plan_attributes = plan_attributes
    }

    async createPlan(plan_id) {
        return await plan.create({...this, _id: plan_id})
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
}

class Pro extends Plan {
    async createPlan() {
        const newPro = await pro.create({
            ...this.plan_attributes,
            plan_owner: this.plan_owner
        })
        if (!newPro) throw new BadRequestError('create new pro error')

        const newPlan = await super.createPlan(newPro._id)
        if (!newPlan) throw new BadRequestError('create new plan error')

        return newPlan
    }
}

module.exports = PlanFactory