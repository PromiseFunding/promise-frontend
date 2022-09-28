Moralis.Cloud.afterSave("FunderAdded", async (request) => {
    const confirmed = request.object.get("confirmed")
    const logger = Moralis.Cloud.getLogger()
    if (confirmed) {
        logger.info("Funder Added :D")
        const ActiveItem = Moralis.Object.extend("ActiveFunder")

        const query = new Moralis.Query(ActiveItem)
        query.equalTo("funder", request.object.get("funder"))
        query.equalTo("owner", request.object.get("owner"))
        query.equalTo("assetAddress", request.object.get("assetAddress"))

        const alreadyListedItem = await query.first()
        if (alreadyListedItem) {
            log("")
            log("hey!", alreadyListedItem.get("amount"))
        }

        const activeItem = new ActiveItem()
        activeItem.set("funder", request.object.get("funder"))
        activeItem.set("owner", request.object.get("owner"))
        activeItem.set("assetAddress", request.object.get("assetAddress"))
        activeItem.set("amount", request.object.get("amount"))
        logger.info(
            `Adding Address: ${request.object.get("address")}. TokenId: ${request.object.get(
                "tokenId"
            )}`
        )
        logger.info("Saving...")
        await activeItem.save()
    }
})
