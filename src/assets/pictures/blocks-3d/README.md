images comes from [Minecraft Bedrock Wiki](https://minecraftbedrock-archive.fandom.com/wiki/Blocks)

- replace the HTML code

  ```js
  replaceAll(
    .+href="(https://static.wikia.nocookie.net/minecraftpocketedition/.+/revision/latest\?cb=.+)"/g,
    'wget $1'
  )
  replaceAll(^[^(wget)].+\n/g,)
  replaceAll(([^/]+)(/revision/.+)/g, '$1$2 -O ./$1 &')
  ```

- run the bash code :)
