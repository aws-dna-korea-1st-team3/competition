#!/usr/bin/env python3
import logging
import os
import time
import random
import string

logging.basicConfig(level=logging.INFO)

def get_file_paths_recursively(dirname, ext):
  files = []
  for r, _, f in os.walk(dirname):
      for file in f:
          if '.' + ext in file:
              files.append(os.path.join(r, file))
  return files

def create_getting_next_dots(): 
  number_of_dots = 1
  def get_next_dots():
      nonlocal number_of_dots
      dots = ""
      for _ in range(0, number_of_dots):
          dots += "."
      number_of_dots %= 3
      number_of_dots += 1

      return dots
  return get_next_dots

get_next_dots = create_getting_next_dots()

def wait_until_status(lambdaToGetStatus, messagePrefix, expectedStatus):
    while True:
        status = lambdaToGetStatus()
        if status != expectedStatus:
            logging.info(messagePrefix + " current status: " + status + get_next_dots())
            time.sleep(1.5)
        else:
            logging.info("expected status achieved: " + status)
            break

def get_random_string(length):
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for i in range(length))
