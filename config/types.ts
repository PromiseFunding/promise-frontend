type Dictionary = {
    [x: string]: string[]
}

export interface contractAddressesInterface {
    [key: string]: Dictionary
}

export interface propType {
    fundAddress: string
    assetAddress: string
}

export interface propTypeFunds {
    fundAddressArray: string[]
}
