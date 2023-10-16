import discord
from discord.ext import commands
from decouple import config

bot = commands.Bot(command_prefix='!')

sniped_messages = {}

@bot.event
async def on_message_delete(message):
    sniped_messages[message.channel] = message

@bot.command()
async def snipe(ctx):
    sniped_message = sniped_messages.get(ctx.channel)

    if sniped_message is not None:
        embed = discord.Embed(description=sniped_message.content, color=discord.Color.red())
        embed.set_author(name=sniped_message.author.name, icon_url=sniped_message.author.avatar_url)
        await ctx.send(embed=embed)
    else:
        await ctx.send("No recently deleted messages to snipe.")

# Load the bot token from the .env file
BOT_TOKEN = config('TOKEN')

bot.run(BOT_TOKEN)
