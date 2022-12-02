import React from 'react';

type Dictionary = {
    [x: string]: string[]
}

export interface contractAddressesInterface {
    [key: string]: Dictionary
}

export interface propType {
    fundAddress: string
    assetAddress?: string
    ownerFund?: string
    onChangeAmountFunded?(arg0: void): void
    onChangeState?(arg0: void): void
    updateAmount?: number
    tranche?: number
    milestoneDurations?: number[]
    decimals?: number
    coinName?: string
    userAddress?: string
    currState?: number
    totalRaised?: number
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
    name: string,
    description: string,
    duration: string
}

export interface databaseFundObject {
    fundTitle: string
    imageURL: string
    description: string
    category: string
    locktime: string
    asset: string
}
