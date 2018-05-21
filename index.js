const discord = require(`discord.js`),
  client = new discord.Client(),
  prefix = `q.`, //Bot prefix
  token = ``, //Your bot token
  ytdl = require(`ytdl-core`),
  songs = require(`./songs.js`);

let status = false,
  correct = false,
  songinfo = ``,
  connection = ``,
  dispatcher;

client.on(`ready`, () => {
  console.log(`ログインが完了しました。`);
});

client.on(`message`, (msg) => {
  if (!msg.guild) return;
  if (msg.author.bot) return;
  if (msg.content.startsWith(prefix)) {
    const split = msg.content.replace(prefix, ``).split(` `);
    if (split[0] === `ping`) {
      msg.channel.send(`ポン！ Ping の確認に成功しました！ボットの Ping は ${Math.floor(client.ping)}ms です！`);
    } else if (split[0] === `connect`) {
      if (msg.member.voiceChannel) {
        msg.member.voiceChannel.join().then((connection) =>
          msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name}」の参加に成功しました。`)
        ).catch((error) => {
          if (msg.member.voiceChannel.full) {
            msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name} は満員のため、参加することができませんでした。`);
          } else if (!msg.member.voiceChannel.joinable) {
            msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name} に参加する権限が与えられていないため、参加することができませんでした。`);
          } else {
            msg.channel.send(`予期せぬエラーが発生したため、ボイスチャンネル「${msg.member.voiceChannel.name} に参加することができませんでした。このエラーは自動的に開発者へと送信されます（個人情報は一切収集されません）`);
            console.error(`ボットの参加時にエラーが発生しました：${error}`);
          }
        });
      } else {
        msg.channel.send(`ボットが参加するボイスチャンネルに参加してからもう一度お試しください。`);
      }
    } else if (split[0] === `disconnect`) {
      if (msg.member.voiceChannel) {
        msg.member.voiceChannel.leave();
        msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name}」を退出しました。`);
      } else {
        msg.channel.send(`ボットが退出するボイスチャンネルに参加してからもう一度お試しください。`);
      }
    } else if (split[0] === `quiz`) {
      if (split[1] === `start`) {
        if (msg.member.voiceChannel) {
          msg.member.voiceChannel.join().then((con) => {
            connection = con;
            status = true;
            nextquiz(msg);
          }).catch((error) => {
            if (msg.member.voiceChannel.full) {
              msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name} は満員のため、参加することができませんでした。`);
            } else if (!msg.member.voiceChannel.joinable) {
              msg.channel.send(`ボイスチャンネル「${msg.member.voiceChannel.name} に参加する権限が与えられていないため、参加することができませんでした。`);
            } else {
              msg.channel.send(`予期せぬエラーが発生したため、ボイスチャンネル「${msg.member.voiceChannel.name} に参加することができませんでした。このエラーは自動的に開発者へと送信されます（個人情報は一切収集されません）`);
              console.error(`ボットの参加時にエラーが発生しました：${error}`);
            }
          });
        } else {
          msg.channel.send(`ボットが参加するボイスチャンネルに参加してからもう一度お試しください。`);
        }
      }
      if (split[1] === `end`) {
        if (status) {
          status = false;
          correct = false;
          msg.channel.send(`イントロクイズを終了しました。`);
        } else {
          msg.channel.send(`イントロクイズが既に終了されているか、まだ開始されていません。`);
        }
      }
    }
  } else if (status) {
    if (~songinfo[1].split(` `).indexOf(msg.content))
      correct = true;
    msg.channel.send(`正解！答えは「${songinfo[1]}」でした！\nYouTube: https://youtu.be/${songinfo[0]}`);
    dispatcher.end();
    nextquiz(msg);
  }
});

function nextquiz(msg, number = 0) {
  msg.channel.send(`${++number} 問目！五秒後に始まるよ！`);
  correct = false;
  setTimeout(() => {
    msg.channel.send(`スタート！この曲は何でしょう？音楽の再生が終了するまで誰も答えられなかった場合は、誰にもポイントは入りません。`);
    songinfo = songs[Math.floor(Math.random() * songs.length)];
    console.log(songinfo);
    const stream = ytdl(songinfo[0], {"filter": `audioonly`});
    dispatcher = connection.playStream(stream);
    dispatcher.on(`end`, (end) => {
      if (!correct)
        msg.channel.send(`音楽の再生が終了しました！答えは「${songinfo[1]}」でした！残念...\nYouTube: https://youtu.be/${songinfo[0]}`);
      nextquiz(msg, number);
    });
  }, 5000);
}

client.login(token);
