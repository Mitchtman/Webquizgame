import os, sys

path = "D:/Project/FlagMaster/flags"
filelist = [file for file in os.listdir(path) if file.endswith(".png")]
print(filelist)

flag_dictionary = dict.fromkeys(filelist, "Empty")
print(flag_dictionary)
