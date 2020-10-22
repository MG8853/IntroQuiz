# Intro Quiz Bot / イントロクイズボット

## コマンド

コマンド一覧です。__プレフィックスを除きます。__

| コマンド | 説明 |
| -------- | ---------- |
| help | ヘルプを表示します。 |
| ping | Pingを表示します。 |
| quiz start <YouTube再生リスト> | 再生リストの動画でイントロクイズを開始します。 |
| quiz (stop\|end) | イントロクイズを終了します。 |
| test <テストする文字列> | イントロクイズの正解判定をテストします。 |

# install nodejs
cd /mnt/server
apt -y update
apt -y install libssl1.0-dev curl unzip wget grep gcc g++ make git ffmpeg build-essential
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
apt -y install nodejs npm docker-compose

# clone evobot
cd /mnt/server
wget https://github.com/MG8853/IntroQuiz/archive/master.zip
unzip -o master.zip
mv -f Discord-TTS-Voice-channel-Bot-master/* ./
rm -fr node_modules
rm -fr Discord-TTS-Voice-channel-Bot-master

# setup nodejs bot
cd /mnt/server
npm install
node -v
npm -v