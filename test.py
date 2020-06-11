from gpiozero import LED
from time import sleep
import signal
import sys

# print('halo')

pinEnable = LED(13)
pinDir = LED(19)
pinPulse = LED(21)

pinEnable.off()
pinDir.on()

def signal_handler(sig, frame):
    print('You pressed Ctrl+C!')
    pinEnable.on()
    pinDir.off()
    sys.exit(0)
signal.signal(signal.SIGINT, signal_handler)

for x in range(6*x)::
    pinPulse.on()
    print('hehe')
    sleep(1/1000)
    pinPulse.off()
    print('haha')
    sleep(1/1000)
