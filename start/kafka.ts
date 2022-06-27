import ip from 'ip'
import { Kafka, logLevel } from 'kafkajs'
const host = process.env.HOST_IP || ip.address()
const kafka = new Kafka({
    logLevel: logLevel.DEBUG,
    brokers: [`${host}:9092`],
    clientId: 'simpill-producer',
})
export const topics = {
    emails:'simpill-email-services'
}
export const producer = kafka.producer()
const run = async () => {
    await producer.connect()
}
run().catch(e => console.error(`[example/producer] ${e.message}`, e))
const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']
errorTypes.map(type => {
    process.on(type, async () => {
        try {
            console.log(`process.on ${type}`)
            await producer.disconnect()
            process.exit(0)
        } catch (_) {
            process.exit(1)
        }
    })
})
signalTraps.map(type => {
    process.once(type, async () => {
        try {
            await producer.disconnect()
        } finally {
            process.kill(process.pid, type)
        }
    })
})