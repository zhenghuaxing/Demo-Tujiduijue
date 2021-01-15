module.exports = {
    _musicUrl: null,
    _musicMute: false,
    _musicVolume: 1,
    _effectList: [],
    _effectMute: false,
    _effectVolume: 1,
    _curMusicId: null,
    init() {
        let musicMute = game.localStorage.getItem("musicMute");
        if (musicMute == null) musicMute = false;
        this.musicMute = musicMute;
        let effectMute = game.localStorage.getItem("effectMute");
        if (effectMute == null) effectMute = false;
        this.effectMute = effectMute;
        let musicVolume = game.localStorage.getItem("musicVolume");
        if (musicVolume == null) musicVolume = 1;
        this.musicVolume = musicVolume;
        let effectVolume = game.localStorage.getItem("effectVolume");
        if (effectVolume == null) effectVolume = 1;
        this.effectVolume = effectVolume;
    },
    /****
     * 音乐是否静音
     * ****/
    get musicMute() {
        return this._musicMute;
    },
    set musicMute(value) {
        if (this._musicMute != value) {
            game.localStorage.setItem("musicMute", value);
            this._musicMute = value;
            if (!value)
                this.playMusic(this._musicUrl, true, true);
            else
                cc.audioEngine.stopMusic();
        }
    },
    /**背景音乐音量 */
    get musicVolume() {
        return this._musicVolume;
    },
    set musicVolume(value) {
        if (this._musicVolume != value) {
            game.localStorage.setItem("musicVolume", value);
            this._musicVolume = value;
            cc.audioEngine.setMusicVolume(value);
        }
    },
    /**音效是否静音 */
    get effectMute() {
        return this._effectMute;
    },
    set effectMute(value) {
        if (this._effectMute != value) {
            game.localStorage.setItem("effectMute", value);
            this._effectMute = value;
            if (value)
                cc.audioEngine.stopAllEffects();
        }
    },
    /**音效音量 */
    get effectVolume() {
        return this._effectVolume;
    },
    set effectVolume(value) {
        if (this._effectVolume != value) {
            game.localStorage.setItem("effectVolume", value);
            this._effectVolume = value;
            cc.audioEngine.setEffectsVolume(value);
        }
    },
    /**
     * 播放背景音乐
     */
    playMusic(url, loop, afresh) {
        if (!afresh && this._musicUrl == url) return;
        if (this._musicMute) return;
        this._musicUrl = url;
        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            if (this._curMusicId) cc.audioEngine.stop(this._curMusicId);
            this._curMusicId = cc.audioEngine.playMusic(clip, loop);
        }.bind(this));
    },
    /**暂停播放背景音乐 */
    pauseMusic() {
        cc.audioEngine.pauseMusic();
    },
    /**继续播放背景音乐 */
    resumeMusic() {
        cc.audioEngine.resumeMusic();
    },
    /**停止背景音乐 */
    stopMusic() {
        cc.audioEngine.stopMusic();
    },
    /**
     * 播放音效
     * @param audioName 音乐文件名称，不需要填文件后缀
     * @param loop 是否循环播放
     * @param folder 资源文件夹名称，必须放在resources文件夹下面
     */
    playEffect(url, loop) {
        loop = loop || false;
        this.checkEffect();
        if (this._effectMute) return;
        cc.loader.loadRes(url, cc.AudioClip, function (err, clip) {
            let id = cc.audioEngine.playEffect(clip, loop);
            cc.audioEngine.setVolume(id, this.effectVolume);
            this._effectList.push({"url": url, "id": id});
        }.bind(this));
    },
    checkEffect() {
        for (let i = this._effectList.length - 1; i >= 0; i--) {
            let obj = this._effectList[i];
            if (cc.audioEngine.getState(obj["id"]) == -1)
                this._effectList.splice(i, 1);
        }
    },
    /**
     * 停止某个音效
     * @param audioName
     * @param folder
     */
    stopEffect(url) {
        for (let i = this._effectList.length - 1; i >= 0; i--) {
            let obj = this._effectList[i];
            if (cc.audioEngine.getState(obj["id"]) == -1) {
                this._effectList.splice(i, 1);
                continue;
            }
            if (obj["url"] == url) {
                cc.audioEngine.stopEffect(obj["id"]);
                this._effectList.splice(i, 1);
            }
        }
    },
    /**停止所有音效 */
    stopAllEffect() {
        cc.audioEngine.stopAllEffects();
        this._effectList.length = 0;
    }
};