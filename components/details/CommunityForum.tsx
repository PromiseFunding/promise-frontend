import { useMoralis, useWeb3Contract } from 'react-moralis'
import { SetStateAction, useState, useEffect } from 'react'
import { abi } from "../../constants"
import styles from "../../styles/Home.module.css"
import { propType } from '../../config/types'
import { BigNumber } from "ethers"

export default function CommunityForum(props: propType) {
    const fundAddress = props.fundAddress
    const owner = props.ownerFund
    const totalRaised = props.totalRaised

    const { account } = useMoralis()

    const [isFunder, setIsFunder] = useState(false)

    const { runContractFunction: getFunderVotes } = useWeb3Contract({
        abi: abi,
        contractAddress: fundAddress!,
        functionName: "getFunderVotes",
        params: { funder: account },
    })

    async function updateUI() {
        const funderVotesFromCall = await getFunderVotes() as BigNumber
        setIsFunder(owner != account && funderVotesFromCall.toNumber() > 0)
    }

    useEffect(() => {
        updateUI()
    }, [fundAddress, account, totalRaised])

    return (
        <div>
            {owner != account ? (<div>
                {
                    isFunder ? (
                        <div>
                            funder
                        </div >
                    ) : (<>not funder</>)
                }
            </div>) : (<></>)}
        </div>)
}
