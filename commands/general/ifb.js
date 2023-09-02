const config = {
  name: "ifb",
  description: "info account Facebook",
  usage: ["infofb","infofacebook"],
  credits: "Duy Tuan(ndt22w) refactor // tks for Nguyen Lam (fca-zeid) for the api!",
  cooldown: 5,
};
//địt nhau liên hệ tao
const langData = {
  vi_VN: {
    result:
      "Thông tin của ID: facebook.com/{uid}\nTên người dùng: {name}\nNgày tạo tài khoản: {created_time}\nGiới tính: {gender}\nSố lượt theo dõi: {follower}\nTên đầu: {firstname}\nUsername: {username}\nTiểu sử: {tieusu}\nWebsite: {websex}\nTình trạng mối quan hệ: {relationship_status}\nĐang hẹn hò với: {lol}\nNgày sinh nhật: {birthday}\nTrích dẫn: {quotes}\nXác minh: {tichxanh}\nQuê hương: {hometown}\nNơi làm việc: {bulu}\nĐịa chỉ tài khoản: {dchi}",
    missingInput: "Vui lòng nhập ID tài khoản Facebook của bạn",
    notFound: "Không tìm thấy dữ liệu.",
    error: "Đã xảy ra lỗi. Xin lỗi vì sự bất tiện này.",
  },
  ar_SY: {
    result:
      "معلومات الهوية: {uid}\nاسم المستخدم: {name}\nتاريخ إنشاء الحساب: {created_time}\nتاريخ الميلاد: {birthday}\nحالة العلاقة: {relationship_status}\nعدد المتابعين: {follower}\nعلامة التحقق الزرقاء: {tichxanh}\nالدولة: {locale}, {location}",
    missingInput: "يرجى إدخال معرف حساب Facebook الخاص بك",
    notFound: "لم يتم العثور على بيانات.",
    error: "حدث خطأ. نأسف على الإزعاج.",
  },
  en_US: {
    result:
      "ID: {uid}\nUsername: {name}\nAccount Created: {created_time}\nBirthday: {birthday}\nRelationship Status: {relationship_status}\nFollowers: {follower}\nVerified: {tichxanh2}\nLocation: {locale}, {location}",
    missingInput: "Please enter your Facebook account ID",
    notFound: "Data not found.",
    error: "An error occurred. We apologize for the inconvenience.",
  },
};
// API from Nguyen Lam, facebook.com/100075493308135
async function onCall({ message, args, getLang }) {
  try {
    const input = args[0]; 
    if (!input) return message.reply(getLang("missingInput"));
    const encodedInput = encodeURIComponent(input);
    const url = `https://api.zeidbot.site/fbin4v2?uid=${encodedInput}`;
    const res = await global.GET(url);
    const data = res?.data || {};

    if (Object.keys(data).length === 0) {
      return message.reply(getLang("notFound"));
    }
    //tao them lon
     const gender = res.data.gender ? "Nam" : "Nữ";
    //dit con me may luon
const tichxanh2 = res.data.tichxanh ? "Đã được xác minh" : "Không được xác minh"
    const response = getLang("result", {
      
      //uid
      uid: data.uid,
      //tao thèm lồn trẻ con
      tieusu: data.tieusu,
      //tên đầu lồn
      username: data.username,
      //username đéo thích thì bỏ mẹ mày đi
      firstname: data.firstName,
      //tên fb
      name: data.name,
      //link fb địt mẹ mày
      linkfb: data.link,
      //ngày tạo acc
      created_time: data.ngaytaoacc,
      //số ng theo dõi
      follower: data.follower,
      //im momkf
      relationship_status: data.relationship_status,
      //happy birthday
     birthday: data.birthday,
     
      //đi làm
      work: data.work,
      //châm ngôn thầy huấn
      quotes: data.quotes,
      //tick xanh
      tichxanh: tichxanh2,
      //que may o dau
      hometown: res.data.hometown.name,
      //dia chi nha may o dau
      dchi: res.data.location.name,
      //may lam o dau
      bulu: res.data.work.name,
      //crush cam sung r
      lol: res.data.significant_other.name,
      //sex
      gender: gender,
      websex: res.data.website.name,
        //if (Object.keys(data).length === 1) {
       //return
                             
      
      

    });

    return message.reply(response);
  } catch (e) {
    console.error(e);
    return message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall,
};
