import cron from "node-cron";
import BlackListTokens from "../../DB/Models/blacl-listed-tokens.model";


// Cron Jop For Delete Tokens
export const deleteTokens = () => {
    cron.schedule("0 0 * * *", async () => {
        await BlackListTokens.deleteMany({
            expirationDate: {
                $lt: new Date(),
            },
        });
    });
};