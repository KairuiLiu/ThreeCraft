### Resource folder

- `./font` folder:

  - `mplus_hzk_12.ttf`comes from [Luckeee/mplus_hzk_12](https://github.com/Luckeee/mplus_hzk_12)

- `./lang` folder: language package

- `./sounds` folder: some sounds, comes from `~/.minecraft/assets`, sounds extracted by [Minecraft Wiki](https://minecraft.fandom.com/wiki/Tutorials/Sound_directory)

- `./textures` folder: all textures, comes from `~/.minecraft/versions/1.18.2/1.18.2.jar`

  - `blocks-clipped` is the texture clipped from `~/.minecraft/versions/1.18.2/1.18.2.jar/blocks`
  - entity is the texture clipped from `~/.minecraft/versions/1.18.2/1.18.2.jar`, and add some 3 part texture from [MCBBS](https://www.mcbbs.net/thread-860483-1-1.html)

- `./pictures` includes other image assets

  - `blocks-3d-clipped` clips from [Minecraft Bedrock Wiki](https://minecraftbedrock-archive.fandom.com/wiki/Blocks)

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

  - `user-icon.png` comes from [Minecraft Bedrock Wiki](https://www.gamergeeks.net/apps/minecraft/web-developer-tools/css-blocks-and-entities/icons-minecraft-0.4.png)

  - `background.png` comes from [wallpapercave](https://wallpapercave.com/w/wp9172734)

  - `./joy-stick` comes from [vippng](https://www.vippng.com/png/full/124-1244749_ps4-controller-png.png) and [maban](http://console.maban.co.uk/device/xboxone/diagram-xboxone-controller.png)

  - others come from `~/.minecraft/versions/1.18.2/1.18.2.jar`
