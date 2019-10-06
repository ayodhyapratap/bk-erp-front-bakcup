/***
 * App Default Config
 * */

const CONFIG = {
    backendBaseUrl: 'https://bk-erp.plutonic.co.in',
    imageBaseUrl : 'https://bk-erp.plutonic.co.in/media',
    prodDomain : ["clinic.bkarogyam.com","bk-erp.plutonic.co.in"],
    crashHandling : {
        slack : {
            sendOnProduction : true,
            sendOnDevelopment : false,
            webHookUrl : "https://hooks.slack.com/services/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",
        }
    }
}
export default CONFIG;
