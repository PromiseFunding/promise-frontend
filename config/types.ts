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
}



export interface propTypeEntryNumber {
    onChangeAmount(arg0: Number): void
    amount: Number
}

export interface propTypeFunds {
    fundAddressArray: string[]
    query?: string
}

export interface milestone {
    name: string,
    description: string
}

export interface databaseFundObject {
    fundTitle: string
    imageURL: string
    description: string
    category: string
    locktime: string
    asset: string
}
