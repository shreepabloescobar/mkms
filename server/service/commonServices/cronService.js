const CronJob = require('cron').CronJob;
const { createSubBatchService } = require('../subBatchService')

const importSubbatchCron = new CronJob(process.env.SUB_BATCH_DATA_TIME, async ()=>{
    console.log('cron running at 11 am');
    await createSubBatchService();
  }, null, true, 'Asia/Kolkata');


module.exports = {
    importSubbatchCron
}  

