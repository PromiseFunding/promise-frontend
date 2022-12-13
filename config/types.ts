import React from 'react';
import { BigNumber } from 'ethers';

type Dictionary = {
    [x: string]: string[]
}

export interface contractAddressesInterface {
    [key: string]: Dictionary
}

export interface update {
    [key: string]: {
        description: string
        subject: string
        imageUrl: string
        timestamp: number
    }
}

export interface updates {

}

export interface propType {
    fundAddress: string
    assetAddress?: string
    ownerFund?: string
    onChangeAmountFunded?(arg0: void): void
    onChangeState?(arg0: void): void
    onGetFunderInfo?(funder: string, level: number): void
    updateAmount?: number
    tranche?: number
    milestoneDurations?: number[]
    decimals?: number
    coinName?: string
    userAddress?: string
    currState?: number
    totalRaised?: number
    timeLeftVoting?: number
    milestoneSummary?: milestoneSummary
    funderSummary?: funderSummary
}


export interface propTypeEntryNumber {
    onChangeAmount(arg0: Number): void
    amount: Number
}

export interface propTypeFunds {
    fundAddressArray: string[]
    query?: string
    children: React.ReactNode;
}

export interface milestone {
    name?: string
    description?: string
    duration?: string
    startTime?: BigNumber
    milestoneDuration?: BigNumber
    totalRaised?: BigNumber
    activeRaised?: BigNumber
}

export interface milestoneSummary {
    milestones: milestone[]
    currentTranche: number
    assetAddress: string
    state: number
    preTotalFunds: BigNumber
    preDuration: BigNumber
    lifeTimeRaised: BigNumber
    owner: string
    timeLeftRound: BigNumber
    votesTried: BigNumber
    timeLeftVoting: BigNumber
    funderCalledVote: boolean
    preMilestoneTotalFunded: number
    preFundingDuration: BigNumber
}

export interface funderSummary {
    didFunderWithdraw: boolean
    didFunderVote: boolean
    funderTrancheAmountRaised: BigNumber
    trancheAmountRaised: BigNumber
    trancheTotalAmountRaised: BigNumber
    fundAmount: BigNumber
}

export interface databaseFundObject {
    fundTitle: string
    imageURL: string
    description: string
    category: string
    locktime: string
    asset: string
}
