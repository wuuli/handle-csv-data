import parse from 'csv-parse'
import stringify from "csv-stringify";
import fs from 'fs'
import readline from 'readline'
import path from "path";

const getFirstLine = (path: string) => {
  return new Promise<string>(resolve => {
    const readable = fs.createReadStream(path)
    const reader = readline.createInterface(readable)
    reader.on('line', input => {
      reader.close()
      readable.close()
      resolve(input)
    })
  })
}

const DATA_DIR = 'C:\\Users\\Admin\\Desktop\\2022_02_14_03_20'
const ORIGIN_DATA_FILE = 'streamlabs_output.csv'

const GPU_LOCAL_USAGE = /.*\\GPU Process Memory\(.*\)\\Local Usage$/
const GPU_UTILIZATION_PERCENTAGE = /.*\\GPU Engine\(.*\)\\Utilization Percentage$/
const PROCESS_PROCESSOR_TIME = /.*\\Process\(.*\)\\% Processor Time$/
const PROCESS_WORKING_SET = /.*\\Process\(.*\)\\Working Set - Private$/

const outputDir = path.join(DATA_DIR, 'output')
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir)
}
const originDataFilePath = path.join(DATA_DIR, ORIGIN_DATA_FILE);

(async () => {
  const firstLine = await getFirstLine(originDataFilePath)
  const counters = firstLine.split(',').map(value => value.slice(1, -1))

  const gpuLocalUsageCounters = counters.filter(value =>
    GPU_LOCAL_USAGE.test(value)
  )
  console.info('gpuLocalUsageCounters -->', gpuLocalUsageCounters)

  const gpuUtilizationPercentageCounters = counters.filter(value =>
    GPU_UTILIZATION_PERCENTAGE.test(value)
  )
  console.info('gpuUtilizationPercentageCounters -->', gpuUtilizationPercentageCounters)

  const processProcessorTimeCounters = counters.filter(value =>
    PROCESS_PROCESSOR_TIME.test(value)
  )
  console.info('processProcessorTimeCounters -->', processProcessorTimeCounters)

  const processWorkingSetCounters = counters.filter(value =>
    PROCESS_WORKING_SET.test(value)
  )
  console.info('processWorkingSetCounters -->', processWorkingSetCounters)

  const parserStream = fs.createReadStream(originDataFilePath)
    .pipe(
      parse({
        columns: true
      })
    )

  parserStream.pipe(
    stringify({
      header: true,
      columns: [counters[0], ...gpuLocalUsageCounters]
    })
  ).pipe(
    fs.createWriteStream(path.join(outputDir, 'gpu_local_usage.csv'))
  )

  parserStream.pipe(
    stringify({
      header: true,
      columns: [counters[0], ...gpuUtilizationPercentageCounters]
    })
  ).pipe(
    fs.createWriteStream(path.join(outputDir, 'gpu_utilization_percentage.csv'))
  )

  parserStream.pipe(
    stringify({
      header: true,
      columns: [counters[0], ...processProcessorTimeCounters]
    })
  ).pipe(
    fs.createWriteStream(path.join(outputDir, 'process_processor_time.csv'))
  )

  parserStream.pipe(
    stringify({
      header: true,
      columns: [counters[0], ...processWorkingSetCounters]
    })
  ).pipe(
    fs.createWriteStream(path.join(outputDir, 'process_working_set.csv'))
  )

})()
