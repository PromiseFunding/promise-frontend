import { contractAddresses, abi } from "../../constants"
import styles from "../../styles/Home.module.css"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from "react"
import { BigNumber } from "ethers"
import { networkConfig } from "../../config/helper-config"
import { contractAddressesInterface, propType } from "../../config/types"

//contract is already deployed... trying to look at features of contract
export default function PoolInfoYield(props: propType) {
    const fundAddress = props.fundAddress
    const yieldSummary = props.fundSummary

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

    const [locktime, setLockTime] = useState(0)

    async function updateUI() {
        const ownerFromCall = yieldSummary!.owner
        const assetFromCall = yieldSummary!.assetAddress
        const locktimeFromCall = yieldSummary!.i_lockTime
        setLockTime(locktimeFromCall.toNumber())
        setAsset(assetFromCall)
        setOwner(ownerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled && yieldSummary) {
            updateUI()
        }
    }, [isWeb3Enabled, yieldSummary])

    return (
        <div style={{ width: "100%", borderRadius: "10px", position: "relative" }}>
            <div className="my-20 drop-shadow rounded-md">
                <details className="bg-slate-300 open:bg-slate-200 duration-300 rounded">
                    <summary className="bg-inherit px-5 py-3 text-lg cursor-pointer font-bold">
                        Fund Information
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
                                <div>
                                    Lock Time: {locktime} seconds
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
