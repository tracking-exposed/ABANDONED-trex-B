This script help to keep in mind development notes

## setup
You need Redis 5 https://github.com/antirez/redis/archive/5.0-rc3.tar.gz

On a different terminal

$ redis-cli
127.0.0.1:6379> monitor

## commands workflow

```
$(npm bin)/processorctl start -s impressions -p @tracking-exposed/process-entities -S entities  
```

-s is the name of the source stream
-p the package which executes dandelion
-S is the output stream name

redis-cli will display:
```
1531133432.608073 [0 127.0.0.1:41062] "info"
1531133432.616974 [0 127.0.0.1:41062] "xread" "BLOCK" "0" "STREAMS" "impressions" "$"
```

```
$(npm bin)/processorctl start -s entities -p @tracking-exposed/process-rss
```

-s is the stream I'm looking for, `entities` is a strean name (defined on the previous command)
-p is the processor call after 

## .processor.json

```
tracking@ISL-amsterdam:~/tracking-exposed$ cat .processor.json 
{
	"dandelionToken": "take your own dev token",
	"mongoDb": "facebook",
	"dataPath": "/home/tracking/data"
}

```

# Adding impressionId

In redis-cli

```
127.0.0.1:6379> XADD "impressions" "*" "impressionId" "58409d674bbec3d9990da497efd0a6d518fef13e" 
1531135148502-0
127.0.0.1:6379> XADD "impressions" "*" "impressionId" "068f668d42f79c58e3d1c88427910d1d893f1a10" 
1531135153928-0
127.0.0.1:6379> XADD "impressions" "*" "impressionId" "e710eea8808195dab983c1653a1113529c8d4a37" 
```


