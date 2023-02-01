function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}

const getNotifications = async() => {
    console.log("sending notifications");
    // const response = await fetch(`http://127.0.0.1:9000/sample`);
    const response = await fetch(`http://127.0.0.1:9000/receiveNotifications/0x9565DAD541140C40d5Fa393e30914fdAeDb13471`);
    const jsonResponse = await response.json();
  
    const fetchedNotifications = jsonResponse.notifications;
    // const stateData = await wallet.request({
    //   method: 'snap_manageState',
    //   params: ['get']
    // });

    const stateData ={web2Notifications: [
        {
          cta: '',
          title: 'Pay request from 0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 - ',
          message: '0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 has requested 11 - ',
          icon: 'https://gateway.ipfs.io/ipfs/bafybeig4xdqoaeh7oupxjwfbsydstnw6iwzjoeb5t5qqdmqsvn3owouaui/QmbpQWRaBCnj29Fts1aF7St8uDopBWQGoPKsuHT4BKfnqD',
          url: 'https://docs.alchemy.com/',
          sid: '2309856',
          app: 'IITBBS',
          image: '',
          blockchain: 'ETH_TEST_GOERLI',
          notification: {
            body: '0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 has requested 11',
            title: 'IITBBS - Pay request from 0x0F7a5f559E6dbCE69071C9'
          },
          secret: ''
        },
        {
          cta: '',
          title: 'Pay request from 0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 - ',
          message: '0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 has requested 12 - ',
          icon: 'https://gateway.ipfs.io/ipfs/bafybeig4xdqoaeh7oupxjwfbsydstnw6iwzjoeb5t5qqdmqsvn3owouaui/QmbpQWRaBCnj29Fts1aF7St8uDopBWQGoPKsuHT4BKfnqD',
          url: 'https://docs.alchemy.com/',
          sid: '2309057',
          app: 'IITBBS',
          image: '',
          blockchain: 'ETH_TEST_GOERLI',
          notification: {
            body: '0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 has requested 12',
            title: 'IITBBS - Pay request from 0x0F7a5f559E6dbCE69071C9'
          },
          secret: ''
        },
        {
          cta: '',
          title: 'Pay request from 0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 - ',
          message: '0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 has requested 10 - ',
          icon: 'https://gateway.ipfs.io/ipfs/bafybeig4xdqoaeh7oupxjwfbsydstnw6iwzjoeb5t5qqdmqsvn3owouaui/QmbpQWRaBCnj29Fts1aF7St8uDopBWQGoPKsuHT4BKfnqD',
          url: 'https://docs.alchemy.com/',
          sid: '2306450',
          app: 'IITBBS',
          image: '',
          blockchain: 'ETH_TEST_GOERLI',
          notification: {
            body: '0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 has requested 10',
            title: 'IITBBS - Pay request from 0x0F7a5f559E6dbCE69071C9'
          },
          secret: ''
        },
        {
          cta: '',
          title: 'Pay request from 0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 - ',
          message: '0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 has requested 10 - ',
          icon: 'https://gateway.ipfs.io/ipfs/bafybeig4xdqoaeh7oupxjwfbsydstnw6iwzjoeb5t5qqdmqsvn3owouaui/QmbpQWRaBCnj29Fts1aF7St8uDopBWQGoPKsuHT4BKfnqD',
          url: 'https://docs.alchemy.com/',
          sid: '2306449',
          app: 'IITBBS',
          image: '',
          blockchain: 'ETH_TEST_GOERLI',
          notification: {
            body: '0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 has requested 10',
            title: 'IITBBS - Pay request from 0x0F7a5f559E6dbCE69071C9'
          },
          secret: ''
        },
        {
          cta: '',
          title: 'Pay request from 0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 - ',
          message: '0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 has requested 8 - ',
          icon: 'https://gateway.ipfs.io/ipfs/bafybeig4xdqoaeh7oupxjwfbsydstnw6iwzjoeb5t5qqdmqsvn3owouaui/QmbpQWRaBCnj29Fts1aF7St8uDopBWQGoPKsuHT4BKfnqD',
          url: 'https://docs.alchemy.com/',
          sid: '2305863',
          app: 'IITBBS',
          image: '',
          blockchain: 'ETH_TEST_GOERLI',
          notification: {
            body: '0x0F7a5f559E6dbCE69071C9734efD80e283E898A5 has requested 8',
            title: 'IITBBS - Pay request from 0x0F7a5f559E6dbCE69071C9'
          },
          secret: ''
        },
        {
          cta: '',
          title: 'Notification-2',
          message: 'Notfication-2',
          icon: 'https://gateway.ipfs.io/ipfs/bafybeig4xdqoaeh7oupxjwfbsydstnw6iwzjoeb5t5qqdmqsvn3owouaui/QmbpQWRaBCnj29Fts1aF7St8uDopBWQGoPKsuHT4BKfnqD',
          url: 'https://docs.alchemy.com/',
          sid: '1838934',
          app: 'IITBBS',
          image: '',
          blockchain: 'ETH_TEST_GOERLI',
          notification: { body: 'Notfication-2', title: 'IITBBS - Notification-2' },
          secret: ''
        },
        {
          cta: 'https://www.youtube.com/watch?v=R1xbMIp4TFo',
          title: 'About you',
          message: 'Hi! You are awesome',
          icon: 'https://gateway.ipfs.io/ipfs/bafybeig4xdqoaeh7oupxjwfbsydstnw6iwzjoeb5t5qqdmqsvn3owouaui/QmbpQWRaBCnj29Fts1aF7St8uDopBWQGoPKsuHT4BKfnqD',
          url: 'https://docs.alchemy.com/',
          sid: '1837170',
          app: 'IITBBS',
          image: 'https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F3468307565-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FpQzrIQwtTyxis5s10tsE%252Ficon%252Fl8rvDFU8iDtwaHtjKCR1%252F',
          blockchain: 'ETH_TEST_GOERLI',
          notification: { body: 'Hi! You are awesome', title: 'IITBBS - About you' },
          secret: ''
        }
      ]
    }
    // console.log(fetchedNotifications);
    const oldNotifs = stateData.web2Notifications;
    let hasNew = false;
    // fetchedNotifications.forEach(element => {
    //   if(!oldNotifs.includes(element)) {
    //     hasNew = true;
    //     return;
    //   }
    // });

    // if(!Arrays.equals(oldNotifs, fetchedNotifications)) {
    //     hasNew = true;
    // }

    // if(!arrayEquals(fetchedNotifications, oldNotifs)) {
    //     hasNew = true;
    // }

    console.log(oldNotifs[0], fetchedNotifications[0]);
    console.log(JSON.stringify(oldNotifs[0]) === JSON.stringify(fetchedNotifications[0]))
  
    // for(let i = 0; i<fetchedNotifications.length; i++) {
    //   if(!oldNotifs.includes(fetchedNotifications[i])) {
    //     hasNew = true;
    //     console.log(i);
    //     break;
    //   }
    // }
    // await wallet.request({
    //   method: 'snap_manageState',
    //   params: ['update', {...stateData, web2Notifications:fetchedNotifications}]
    // });
  
    // await wallet.request({
    //   method: 'snap_manageState',
    //   params: ['update', {...stateData, web2Notifications:oldNotifs}]
    // });
    return hasNew;
}

// console.log(getNotifications());

getNotifications()
// .then(res => console.log(res));


