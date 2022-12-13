import { contractAddresses, abi } from "../constants"
import styles from "../styles/Home.module.css"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { BigNumber } from "ethers"
import { networkConfig } from "../config/helper-config"
import { contractAddressesInterface, propType } from "../config/types"

//contract is already deployed... trying to look at features of contract
export default function PoolInfo(props: propType) {
    const fundAddress = props.fundAddress
    const milestoneSummary = props.milestoneSummary

    const addresses: contractAddressesInterface = contractAddresses
    const { chainId: chainIdHex, isWeb3Enabled, user, isAuthenticated, account } = useMoralis()
    const chainId: string = parseInt(chainIdHex!).toString()

    //TODO: get helper-config working instead!... gets rid of decimal function
    const chainIdNum = parseInt(chainIdHex!)

    const poolAddress = chainId in addresses ? networkConfig[chainIdNum].poolAddress : null

    const tracker = chainId in addresses ? networkConfig[chainIdNum].tracker : null

    //setEntranceFee triggers the update
    const [owner, setOwner] = useState("0")

    const [asset, setAsset] = useState("0")

    async function updateUI() {
        const ownerFromCall = milestoneSummary!.owner
        const assetFromCall = milestoneSummary!.assetAddress
        setAsset(assetFromCall)
        setOwner(ownerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled && milestoneSummary) {
            updateUI()
        }
    }, [isWeb3Enabled, milestoneSummary])

    return (
        <div className="py-5 px-5 text-slate-800">
            <div className="my-20 w-[600px] drop-shadow rounded-md">
                <details className="bg-slate-400 open:bg-slate-200 duration-300">
                    <summary className="bg-inherit px-5 py-3 text-lg cursor-pointer font-bold">
                        Fund / Pool Information:
                    </summary>
                    <div className="bg-white px-5 py-3 border border-gray-300 text-slate-800 text-sm font-light">
                        {isWeb3Enabled && fundAddress ? (
                            <div className="font-normal">
                                <div>
                                    Fund Address:
                                    <a href={tracker + fundAddress}>
                                        <u className={styles.fundinfo}><b className={styles.fundinfo}>{fundAddress}</b></u>
                                    </a>
                                </div>
                                <div>
                                    Owner Address:
                                    <a href={tracker + owner}>
                                        <u className={styles.fundinfo}><b className={styles.fundinfo}>{owner}</b></u>
                                    </a>
                                </div>
                                <div>
                                    User Address:
                                    <a href={tracker + account!}>
                                        <u className={styles.fundinfo}><b className={styles.fundinfo}>{account}</b></u>
                                    </a>
                                </div>
                                <div>
                                    Pool Address:
                                    <a href={tracker + poolAddress!}>
                                        <u className={styles.fundinfo}><b className={styles.fundinfo}>{poolAddress}</b></u>
                                    </a>
                                </div>
                                <div>
                                    Asset Address:
                                    <a href={tracker + asset}>
                                        <u className={styles.fundinfo}><b className={styles.fundinfo}>{asset}</b></u>
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div>No Fund Address Detected</div>
                        )}
                    </div>
                </details>
            </div>
        </div>
    )
}
