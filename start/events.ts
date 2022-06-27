/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import Event from '@ioc:Adonis/Core/Event'
import Database from '@ioc:Adonis/Lucid/Database'
import { RegisterEvent, RegisterEvent2 } from './events/RegisterEvent'

Event.on('db:query', Database.prettyPrint)
Event.on('new:user', RegisterEvent)
Event.on('new:user2', RegisterEvent2)