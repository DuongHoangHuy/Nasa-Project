# Local deployment

Start a redis via docker:
```
docker run -p 6379:6379 -it redis
```

Then:
```
docker run -p 8000:8000 -it dhhuy/nasa-project-amd64
```

# Demo
Deploy in aws ec2 instance:

http://huydh.id.vn:8000/
