//

// TODO:
// when just loggged in and visited quests, check for "all quests done reward" if ready to claim - claim
// separate quests parse error and all done
// in shop buy panties

"use strict"

const fs = require("fs")

const HH_PROTOCOL = "https"
const HH_HOST = "www.hentaiheroes.com"
const HH_DEFAULT_COOKIES_FILE = "./default.cookies"
const HH_WTF_FILE = "./mem/hhbot.wtf"
const HH_ID_TROLL_DEFAULT = 1

const HH_AUTH_PATH = "/phoenix-ajax.php"
const HH_HAREM_PATH = "/harem.html"
const HH_QUESTS_PATH = "/activities.html?tab=missions"
const HH_ARENA_PATH = "/arena.html"
const HH_COLLECT_BITCH_MONEY_PATH = "/ajax.php"
const HH_CLAIM_QUEST_REWARD_PATH = "/ajax.php"
const HH_START_QUEST_PATH = "/ajax.php"
const HH_ATTACK_PLAYER_PATH = "/ajax.php"
const HH_CLAIM_ALL_QUEST_COMPLETE_REWARD_PATH = "/ajax.php"
const HH_ARENA_ENTER_BATTLE_PATH = "/battle.html"
const HH_HOME_PATH = "/home.html"
const HH_MOVE_SCENARIO_PATH = "/ajax.php"
const HH_TROLL_ENTER_BATTLE_PATH = "/battle.html"
const HH_ATTACK_TROLL_PATH = "/ajax.php"

const Bot = require("./Bot")

class HHBot {
    void() {}

    constructor(conf) {
        this.conf = conf

        this.bot = new Bot({
            protocol: HH_PROTOCOL,
            host: HH_HOST,
            cookiesFile: this.conf.cookiesFile || HH_DEFAULT_COOKIES_FILE,
            ajaxJson: true,
        })

        this.wtfFile = conf.wtfFile || HH_WTF_FILE

        this.idTroll = conf.idTroll || HH_ID_TROLL_DEFAULT

        this.bitchTimers = {}

        this.afterDelays = {}

        this.subjColors = {
            troll: "\x1b[31m",
            quests: "\x1b[32m",
            scenario: "\x1b[33m",
            harem: "\x1b[34m",
            arena: "\x1b[35m",
            init: "\x1b[36m",
        }
    }

    fail(err) {
        err = (typeof err == "string") ? err : JSON.stringify(err)
        console.error("\x1b[1;31m" + this.date() + "  Fail: " + err + "\x1b[0m")
        process.exit(1)
    }

    log(subj, str) {
        if ( !str ) {
            str = subj
            subj = null
        }

        str = (typeof str == "string") ? str : JSON.stringify(str)

        if ( subj ) {
            let subjColor = this.subjColors[subj] || "\x1b[37m"

            console.log(this.date() + "  " + subjColor + subj + "\x1b[0m  " + str)
        } else {
            console.log(this.date() + "  " + str)
        }
    }

    wtf(subj, str) {
        if ( !str ) {
            str = subj
            subj = null
        }

        str = (typeof str == "string") ? str : JSON.stringify(str)

        if ( subj ) {
            fs.appendFile(this.wtfFile, this.date() + "  " + subj + "  " + str + "\n", this.void)
        } else {
            fs.appendFile(this.wtfFile, this.date() + "  " + str + "\n", this.void)
        }

        this.log(subj, "\x1b[1;33mWTF:\x1b[0m " + str)
    }

    addz(number) {
        return number > 9 ? number : "0" + number
    }

    pushz(number, f) {
        let max = parseInt("9".repeat(f))

        if ( number > max ) {
            return max
        } else {
            number = number + ""
            while ( number.length < f ) number += "0"
            return parseInt(number)
        }
    }

    date(d) {
        d = d || new Date

        return d.getFullYear()
            + "-" + this.addz(d.getMonth()+1)
            + "-" + this.addz(d.getDate())
            + " " + this.addz(d.getHours())
            + ":" + this.addz(d.getMinutes())
            + ":" + this.addz(d.getSeconds())
            + "." + this.pushz(d.getMilliseconds(), 3)
    }

    afterDelay(what, delay = 3600) {
        this.log(what, "wait for "+delay+"s and reload")

        if ( this.afterDelays[what] ) {
            clearTimeout(this.afterDelays[what])
            delete this.afterDelays[what]
        }

        this.afterDelays[what] = setTimeout(this[what].bind(this), delay * 1000)
    }

    html(path, query = {}, method = "GET", recursion = false) {
        method = method || "GET"

        return new Promise((resolve, reject) => {
            this.bot.query(method, path, query, false).then(html => {
                if ( html.match(/phoenix_member_login/) ) {
                    this.log("init", "auth cookies are outdated, re-login")

                    if ( recursion ) {
                        return reject("auth outdated and re-login did not work, die")
                    }

                    this.auth().then(r => {
                        this.log("init", "re-login ok")

                        this.html(path, query, method, true)
                            .then(resolve)
                            .catch(reject)
                    }).catch(reject)
                } else {
                    resolve(html)
                }
            }).catch(reject)
        })
    }

// init

    start() {
        let fail = this.fail.bind(this)

        this.bot.loadCookies().then(() => {
            if ( this.haveAuthCookie() ) {
                this.log("init", "have auth cookies")
                this.logic()
            } else {
                this.log("init", "no auth cookies, must log in")

                this.auth().then(() => {
                    this.log("init", "auth ok")
                    this.logic()
                }).catch(fail)
            }
        }).catch(fail)
    }

    haveAuthCookie() {
        return !!this.bot.cookies.stay_online
    }

    auth() {
        return new Promise((resolve, reject) => {
            if ( !this.conf.login || !this.conf.password ) {
                return reject("login or password not set in HHBot({ ... })")
            }

            this.bot.cookies = {}

            this.html("/").then(html => {
                this.bot.query("POST", HH_AUTH_PATH, {
                    login: this.conf.login,
                    password: this.conf.password,
                    stay_online: 1,
                    module: "Member",
                    action: "form_log_in",
                    call: "Member",
                }).then(json => {
                    if ( json.success ) {
                        resolve(true)
                    } else {
                        reject(json)
                    }
                }).catch(reject)
            }).catch(reject)
        })
    }

    logic() {
        let fail = this.fail.bind(this)

        this.html(HH_HOME_PATH).then(html => {
            this.harem()
            this.quests()
            this.scenario()

            if ( this.idTroll > -1 ) {
                this.troll()
            } else {
                this.arena()
            }
        }).catch(fail)
    }

// harem

    harem() {
        let fail = this.fail.bind(this)

        this.log("harem", "start")

        this.html(HH_HAREM_PATH).then(html => {
            let bitchesTimers = this.getBitchesTimersFromHaremHtml(html)
            this.processBitchesTimers(bitchesTimers)
        }).catch(fail)
    }

    getBitchesTimersFromHaremHtml(html) {
        let bitchesTimers = {}

        let lines = html.match(/girls\[[\s\S]*?\] = new Girl\([\s\S]*?\)/gi)

        if ( !lines ) {
            this.wtf("harem", "no bitches lines")
            return bitchesTimers
        }

        lines.forEach(line => {
            let chunk = line.match(/girls\[.([0-9]+).\] = new Girl\([\s\S]*?pay_in[\s\S]*?([0-9]+)[\s\S]*?\)/i)

            if ( chunk && chunk[1] ) {
                bitchesTimers[chunk[1]] = chunk[2]
            } else {
                this.wtf("harem", "wrong bitch chunk from line: " + line)
                this.afterDelay("harem")
            }
        })

        return bitchesTimers
    }

    processBitchesTimers(timers) {
        let count = 0

        for ( let bitchId in timers ) {
            this.createBitchTimer(bitchId, timers[bitchId])
            count++
        }

        if ( !count ) {
            this.wtf("harem", "no bitches? parse error?")
        }

        this.afterDelay("harem")
    }

    createBitchTimer(bitchId, delaySeconds) {
        if ( this.bitchTimers[bitchId] ) {
            clearTimeout(this.bitchTimers[bitchId])
            delete this.bitchTimers[bitchId]
        }

        delaySeconds++ // to be sure

        this.log("harem", "bitch("+bitchId+") timer: " + delaySeconds + "s")

        this.bitchTimers[bitchId] = setTimeout(
            this.collectBitchMoney.bind(this, bitchId),
            delaySeconds * 1000)
    }

    collectBitchMoney(bitchId) {
        let fail = this.fail.bind(this)

        this.log("harem", "bitch("+bitchId+") ready to collect")

        delete this.bitchTimers[bitchId]

        this.bot.query("POST", HH_COLLECT_BITCH_MONEY_PATH, {
            class: "Girl",
            who: bitchId,
            action: "get_salary",
        }).then(json => {
            if ( json.success && json.time ) {
                this.log("harem", "bitch("+bitchId+") +\$" + json.money)
                this.createBitchTimer(bitchId, json.time)
            } else {
                this.wtf("harem", "bitch("+bitchId+") failed to collect money: " + JSON.stringify(json))
                this.createBitchTimer(bitchId, 1800)
            }
        }).catch(fail)
    }

// quests

    quests() {
        let fail = this.fail.bind(this)

        this.log("quests", "start")

        this.html(HH_QUESTS_PATH).then(html => {
            let quests = this.getQuestsFromQuestsHtml(html)
            this.processQuests(quests)
        }).catch(fail)
    }

    getQuestsFromQuestsHtml(html) {
        let quests = []

        let lines = html.match(/\{"id_member_mission":[\s\S]*?\}/gi)

        if ( !lines ) {
            return quests
        }

        lines.forEach(line => {
            try {
                let json = JSON.parse(line)
                quests.push(json)
            } catch (e) {
                this.wtf("quests", "json parse error: " + JSON.stringify(e.message) + "; line: " + line)
            }
        })

        return quests
    }

    processQuests(quests) {
        if ( !quests.length ) { // no wtf! because you can actually have 0 quests
            this.log("quests", "0 quests? parse error or all complete?")
            this.afterDelay("quests")
            return
        }

        let complete = []
        let progress = []

        let completeIds = {}

        quests.forEach(quest => {
            if ( quest.remaining_time !== null ) {
                quest.remaining_time = parseInt(quest.remaining_time)
                quest.duration = parseInt(quest.duration)

                if ( quest.remaining_time <= 0 ) {
                    complete.push(quest)

                    completeIds[this.getQuestId(quest)] = true
                } else {
                    progress.push(quest)
                }
            }
        })

        this.log("quests", "in total: " + quests.length)
        this.log("quests", "in ready: " + complete.length)
        this.log("quests", "in progress: " + progress.length)

        let lastQuestDone = (quests.length==complete.length)

        if ( complete.length ) {
            complete.forEach(quest => {
                this.claimQuestReward(quest, lastQuestDone)
            })
        }

        if ( progress.length ) {
            this.setupQuestDelayTimer(progress)
        } else {
            this.startShortestQuest(quests, completeIds)
        }
    }

    claimQuestReward(quest, lastQuestDone) {
        let fail = this.fail.bind(this)

        this.log("quests", "quest("+this.getQuestId(quest)+") claiming reward")

        this.bot.query("POST", HH_CLAIM_QUEST_REWARD_PATH, {
            class: "Missions",
            action: "claim_reward",
            id_mission: quest.id_mission,
            id_member_mission: quest.id_member_mission,
        }).then(json => {
            if ( json.success ) {
                this.log("quests", "quest("+this.getQuestId(quest)+") reward received")

                if ( lastQuestDone ) {
                    this.claimAllQuestDoneReward()
                }
            } else {
                this.wtf("quests", "quest("+this.getQuestId(quest)+") reward failed: " + JSON.stringify(json))
                this.afterDelay("quests")
            }
        }).catch(fail)
    }

    claimAllQuestDoneReward() {
        let fail = this.fail.bind(this)

        this.log("quests", "all quests done - get reward")

        this.bot.query("POST", HH_CLAIM_ALL_QUEST_COMPLETE_REWARD_PATH, {
            class: "Missions",
            action: "give_gift",
        }).then(json => {
            if ( json.success ) {
                this.log("quests", "all quests done - get reward - SUCCESS")
            } else {
                this.wtf("quests", "all quests done - get reward - FAIL - " + JSON.stringify(json))
                this.afterDelay("quests")
            }
        }).catch(fail)
    }

    setupQuestDelayTimer(progress) {
        this.log("quests", "setting up quest wait-for-progress-delay")

        let minimalDelay = 3600

        progress.forEach(quest => {
            minimalDelay = Math.min(minimalDelay, quest.duration)
        })

        minimalDelay++ // to be sure

        this.log("quests", "min quest delay time is " + minimalDelay + "s")

        this.afterDelay("quests", minimalDelay)
    }

    getQuestId(quest) {
        return quest.id_member_mission+":"+quest.id_mission
    }

    startShortestQuest(quests, completeIds) {
        this.log("quests", "starting shortest quest")

        let shortestQuest = null

        quests.forEach(quest => {
            if ( completeIds[this.getQuestId(quest)] ) { return }

            if ( !shortestQuest || shortestQuest.duration > quest.duration ) {
                shortestQuest = quest
            }
        })

        if ( !shortestQuest ) {
            this.log("quests", "shortest quest not found? maybe last quest was not collected?")
            this.afterDelay("quests")
        } else {
            this.startQuest(shortestQuest)
        }
    }

    startQuest(quest) {
        let fail = this.fail.bind(this)

        quest.duration++ // to be sure

        this.log("quests", "starting quest(" + this.getQuestId(quest) + ") duration: " + quest.duration + "s")

        this.bot.query("POST", HH_START_QUEST_PATH, {
            class: "Missions",
            action: "start_mission",
            id_mission: quest.id_mission,
            id_member_mission: quest.id_member_mission,
        }).then(json => {
            if ( json.success ) {
                this.log("quests", "quest("+this.getQuestId(quest)+") started")
                this.afterDelay("quests", quest.duration)
            } else {
                this.wtf("quests", "quest("+this.getQuestId(quest)+") start failed: " + JSON.stringify(json))
                this.afterDelay("quests")
            }
        }).catch(fail)
    }

// scenario

    scenario() {
        let fail = this.fail.bind(this)

        this.log("scenario", "start")

        this.html(HH_HOME_PATH).then(html => {
            let id = this.getScenarioIdFromHomeHtml(html)

            if ( id ) {
                this.log("scenario", "id: " + id)

                this.bot.query("POST", HH_MOVE_SCENARIO_PATH, {
                    class: "Quest",
                    action: "next",
                    id_quest: id,
                }).then(json => {
                    if ( json.success ) {
                        this.log("scenario", "move ok")
                        this.afterDelay("scenario", 1)
                    } else {
                        this.log("scenario", "move fail: " + JSON.stringify(json))
                        this.afterDelay("scenario")
                    }
                }).catch(fail)
            } else {
                this.wtf("scenario", "home.html parse fail: can't find scenario chapter id")
                this.afterDelay("scenario")
            }
        }).catch(fail)
    }

    getScenarioIdFromHomeHtml(html) {
        let id = ""

        let m = html.match(/href\s*=\s*.\/quest\/([0-9]+).\s+hh_title\s*=\s*/i)

        if ( m && m[1] ) {
            id = m[1]
        }

        return id
    }

// troll

    troll() {
        let fail = this.fail.bind(this)

        this.log("troll", "start: " + this.idTroll)

        this.html(HH_TROLL_ENTER_BATTLE_PATH, {
            id_troll: this.idTroll,
        }).then(html => {
            let infos = this.getProfileInfosFromHtml(html, "troll")
            let stat = this.getEnemyStatFromTrollHtml(html, infos)

            if ( stat ) {
                this.attackTroll(stat, infos)
            } else {
                this.afterDelay("troll")
            }
        }).catch(fail)
    }

    getProfileInfosFromHtml(html, src = "init") {
        let infos = null

        let json = html.match(/Hero\[.infos.\]\s*=\s*(\{.*\})/i)

        if ( json && json[1] ) {
            try {
                infos = JSON.parse(json[1])
            } catch (e) {
                this.wtf(src, "getProfileInfosFromHtml: json parse error: " + JSON.stringify(e.message) + "; json: " + json[1])
            }
        }

        if ( !infos || !infos.id ) {
            this.wtf(src, "getProfileInfosFromHtml: can't locate my json infos")
            infos = null
        }

        return infos
    }

    getEnemyStatFromTrollHtml(html, infos) {
        let stat = null

        if ( !infos ) {
            this.wtf("troll", "can't parse troll stat without my infos")
            return null
        }

        let lines = html.match(/\{"id_troll":[\s\S]*?\}/gi)

        if ( lines && lines.length ) {
            lines.forEach(line => {
                let json
                try {
                    json = JSON.parse(line)

                    if ( json.id_member != infos.id ) {
                        stat = json
                    }
                } catch(e) {
                    this.wtf("troll", "stat json parse error: " + JSON.stringify(e.message) + "; line: " + line)
                }
            })
        }

        if ( !stat ) {
            this.wtf("troll", "can't locate troll json stats")
            stat = null
        }

        return stat
    }

    attackTroll(stat, infos) {
        let fail = this.fail.bind(this)

        this.log("troll", "attacking: " + JSON.stringify(stat))

        this.bot.query("POST", HH_ATTACK_TROLL_PATH, {
            class: "Battle",
            action: "fight",
            "who[id_troll]": stat.id_troll,
            "who[id_world]": stat.id_world,
            "who[orgasm]": stat.orgasm,
            "who[ego]": stat.ego,
            "who[x]": stat.x,
            "who[d]": stat.d,
            "who[nb_org]": stat.nb_org,
            "who[figure]": stat.figure,
        }).then(json => {
            if ( json.success ) {
                let status = null

                let winner = (json.end && json["J" + json.end.winner])

                if ( winner ) {
                    if ( winner.id_member == infos.id ) {
                        status = "YOU WON"
                    } else {
                        status = "lose :("
                    }
                }

                if ( !status ) {
                    status = "json format outdated: " + JSON.stringify(json)
                }

                this.log("troll", "attack ok: " + status)
                this.afterDelay("troll", 1)
            } else {
                this.log("troll", "attack fail: " + JSON.stringify(json))
                this.afterDelay("troll")
            }
        }).catch(fail)
    }

// arena

    arena() {
        let fail = this.fail.bind(this)

        this.log("arena", "start")

        this.html(HH_ARENA_PATH).then(html => {
            let enemies = this.getEnemiesFromArenaHtml(html)
            this.processArena(enemies)
        }).catch(fail)
    }

    getEnemiesFromArenaHtml(html) {
        let enemies = []

        let lines = html.match(/.opponents_ego.>[\s\S]*?<\/\s*div>/gi)

        lines.forEach(line => {
            let chunk = line.match(/Ego\s+([0-9\.,]+)/i)

            if ( chunk && chunk[1] ) {
                enemies.push(parseInt(chunk[1].replace(",", "")))
            } else {
                this.wtf("arena", "chunk fmt error: line: " + line)
            }
        })

        return enemies
    }

    processArena(enemies) {
        let fail = this.fail.bind(this)

        let lowestPower = null
        let lowestIndex = null

        enemies.forEach((power, index) => {
            if ( lowestPower===null || lowestPower > power ) {
                lowestPower = power
                lowestIndex = index
            }
        })

        if ( lowestIndex === null ) {
            this.wtf("arena", "failed to get enemy with lowest power, enemies: " + JSON.stringify(enemies))
            this.afterDelay("arena")
            return
        }

        this.log("arena", "lowest opponent power: " + lowestPower + " (index="+lowestIndex+")")

        this.html(HH_ARENA_ENTER_BATTLE_PATH, {
            id_arena: lowestIndex,
        }).then(html => {
            let infos = this.getProfileInfosFromHtml(html, "arena")
            let stat = this.getEnemyStatFromArena2Html(html, infos)

            if ( stat ) {
                this.attackPlayer(stat, lowestIndex, infos)
            } else {
                this.wtf("arena", "enemy stats not found")
                this.afterDelay("arena")
            }
        }).catch(fail)
    }

    getEnemyStatFromArena2Html(html, infos) {
        let stat = null

        if ( !infos ) {
            this.wtf("arena", "can't parse enemy stat without my infos")
            return null
        }

        let lines = html.match(/\{"id_member":[\s\S]*?\}/gi)

        if ( lines && lines.length ) {
            lines.forEach(line => {
                let json
                try {
                    json = JSON.parse(line)

                    if ( json.id_member != infos.id ) {
                        stat = json
                    }
                } catch(e) {
                    this.wtf("arena", "stat json parse error: " + JSON.stringify(e.message) + "; line: " + line)
                }
            })
        }

        if ( !stat ) {
            this.wtf("arena", "can't locate enemy json stats")
            stat = null
        }

        return stat
    }

    // stat={id_member:"180728",id_arena:"0",orgasm:4767,ego:1856,x:0,d:1856,nb_org:0,figure:1}
    attackPlayer(stat, id_arena, infos) {
        let fail = this.fail.bind(this)

        this.log("arena", "attacking: " + JSON.stringify(stat))

        this.bot.query("POST", HH_ATTACK_PLAYER_PATH, {
            class: "Battle",
            action: "fight",
            "who[id_member]": stat.id_member,
            "who[id_arena]": stat.id_arena,//id_arena,
            "who[orgasm]": stat.orgasm,
            "who[ego]": stat.ego,
            "who[x]": stat.x,
            "who[d]": stat.d,
            "who[nb_org]": stat.nb_org,
            "who[figure]": stat.figure,
        }).then(json => {
            if ( json.success ) {
                let status = null

                let winner = (json.end && json["J" + json.end.winner])

                if ( winner ) {
                    if ( winner.id_member == infos.id ) {
                        status = "YOU WON"
                    } else {
                        status = "lose :("
                    }
                }

                if ( !status ) {
                    status = "json format outdated: " + JSON.stringify(json)
                }

                this.log("arena", "attack ok: " + status)
                this.afterDelay("arena", 1)
            } else {
                this.log("arena", "attack fail: " + JSON.stringify(json))
                this.afterDelay("arena")
            }
        }).catch(fail)
    }
}

module.exports = HHBot
