![SimplCV](./lib/public/img/logo_320.png)

# Simple, beautiful bios in ~100 words

An early stage project to make it easy to create a simple but beautiful bios with a clean minimalist design. Text shines here.

## New in v0.2.0
- Support for Redis as a back end content store
- Multi-tenant (supports multi user e.g. http://simplcv.com/user/lawrence and http://simplecv/user/phil)
- Editable content behind an admin mode (basic password protected)
- Custom domain support. E.g. supports redirection from www.lawrenceripsher.com -> www.simplcv.com/user/lawrence


## Getting Started

### Single user mode

Single user mode allows you to host a single user. It's very early and lots to do, but you can get up and running with a little effort:

1. Clone this project
2. cp lib/config/production_sample.json lib/config/production.json
3. npm i
4. npm start
5. Browse to http://localhost:4004?edit=abcdefg and edit the content (changes are stored in the files in directory content/)
6. Browse to http://localhost:4004 and admire your work!

### Multi user mode

If you have redis (or simply install it), you can run SimplCV in multi-user mode. This allows you to support multiple users bio's on the same machine. To do this:

1. Clone this project
2. cp lib/config/production_multi_sample.json lib/config/production.json 
3. Edit the lib/config/production.json to your redis location (no need to make changes if redis is running on localhost:6379)
4. npm i
5. npm start
6. Browse to http://localhost:4004/user/testuser1?edit=abcdefg and edit the content
7. Browse to http://localhost:4004/user/testuser2?edit=abcdefg and edit the content
8. Browse to http://localhost:4004/user/testuser1 and http://localhost:4004/user/testuser2 and admire your work!


## Next steps

A few todos:

- Design iteration 
- More included icons
- Create more templates
- Error handling
- One click install to Digital Ocean, Heroku, etc
- Editable UI
