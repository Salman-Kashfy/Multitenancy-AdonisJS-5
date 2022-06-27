import { producer } from '../kafka'
import { CompressionTypes } from 'kafkajs'
import Database from '@ioc:Adonis/Lucid/Database'

const getSettings = async () => {
    return Database.from('settings').first()
}

export const RegisterEvent = async (data:object) => {
    const topic = 'newUser'
    const settings = await getSettings()
    return producer
        .send({
            topic,
            compression: CompressionTypes.GZIP,
            messages: [{
                value:JSON.stringify({
                    tenant:settings,
                    user:data
                })
            }]
        })
        .then(console.log)
        .catch(e => console.error(`[example/producer] ${e.message}`, e))
}

export const RegisterEvent2 = (data:object) => {
    const topic = 'register-user2'
    return producer
        .send({
            topic,
            compression: CompressionTypes.GZIP,
            // messages: [{
            //     key: 'my-key',
            //     value: JSON.stringify({ name:'kashfy1' }),
            // }]
            messages: [{
                value:JSON.stringify(data)
            }]
        })
        .then(console.log)
        .catch(e => console.error(`[example/producer] ${e.message}`, e))
}