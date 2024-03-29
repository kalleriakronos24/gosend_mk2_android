/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable handle-callback-err */
/* eslint-disable quotes */
import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";
import AsyncStorage from "@react-native-community/async-storage";
import { formatRupiah } from "../../../utils/functionality";

const CourierBalance = ({ navigation }) => {
    const barHeight = StatusBar.currentHeight;
    let balance = 1;
    let [data, setData] = useState([]);
    let [wallet, setWallet] = useState(0);

    useEffect(() => {
        let interval = setInterval(() => {
            fetchTransactionData();
        }, 1000 * 10) // 10s

        return () => {
            clearInterval(interval);
            console.log("cleaned up");
        };
    }, []);

    useEffect(() => {
        fetchTransactionData();
    }, [])

    const fetchTransactionData = async () => {
        await AsyncStorage.getItem("LOGIN_TOKEN", async (err, token) => {
            await fetch("http://192.168.43.178:8000/get/request/add/wallet/" + token, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    console.log(res);
                    if (res.error) {
                        setData([]);
                    } else {
                        setData(res.data || []);
                        setWallet(res.wallet);
                    }
                })
                .catch((error) => {
                    throw new Error(error);
                });

        });
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "white", paddingTop: barHeight }}
        >
            <StatusBar
                barStyle="default"
                backgroundColor="rgba(0,0,0,0.251)"
                animated
                translucent
            />
            <View style={{ padding: 16 }}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.goBack()}
                    style={{ padding: 6 }}
                >
                    <Icon name="arrow-back-outline" size={30} />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 16, flex: 1 }}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        letterSpacing: 0.7,
                        textAlign: "center",
                    }}
                >
                    You have {wallet ? formatRupiah(String(wallet), "Rp. ") : 0} Wallet
        </Text>
                {balance === 0 ? (
                    <>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text>You dont have enough wallet to get an orders</Text>
                            <TouchableOpacity
                                onPress={() => navigation.push("add_balance")}
                                activeOpacity={0.7}
                                style={{
                                    padding: 6,
                                    marginTop: 10,
                                    borderRadius: 6,
                                    borderWidth: 0.6,
                                    borderColor: "blue",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        letterSpacing: 0.5,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Isi Wallet
                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                        <View style={{ padding: 10, marginTop: 20 }}>
                            <Text
                                style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 0.5 }}
                            >
                                Transaksi keluarmu akan tampil disini
                        </Text>

                            <View
                                style={{
                                    justifyContent: "space-between",
                                    flex: 1,
                                    marginTop: 10,
                                }}
                            >
                                {data.length === 0 ? (
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: "bold",
                                                letterSpacing: 0.5,
                                                textAlign: "center",
                                                textTransform: "uppercase",
                                                marginVertical: 50,
                                            }}
                                        >
                                            -Tidak ada Transaksi Keluar ditemukan-
                                    </Text>
                                    </View>
                                ) : (
                                        data.map((v, i) => {
                                            return (
                                                <View
                                                    style={{
                                                        padding: 10,
                                                        flexDirection: "column",
                                                        height: 200,
                                                        borderRadius: 10,
                                                        borderWidth: 0.7,
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            ID :{" "}
                                                        </Text>
                                                        <Text>
                                                            {v.id}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            Kode Unik :{" "}
                                                        </Text>
                                                        <Text>{v.reference_id}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            Status :{" "}
                                                        </Text>
                                                        <Text>
                                                            {v.status ? "sudah di verifikasi" : "belum di verifikasi"}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            Tanggal :{" "}
                                                        </Text>
                                                        <Text>
                                                            {v.date}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            User Name :{" "}
                                                        </Text>
                                                        <Text>
                                                            {v.courier_id.fullname}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            Bukti Transfer :{" "}
                                                        </Text>
                                                        <TouchableOpacity
                                                            style={{
                                                                padding: 6,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                borderWidth: 1,
                                                                borderColor: "blue",
                                                                borderRadius: 6,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize: 17,
                                                                    fontWeight: "bold",
                                                                    letterSpacing: 0.5,
                                                                }}
                                                            >
                                                                LIHAT
                                                        </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            );
                                        }))
                                }
                                <TouchableOpacity
                                    onPress={() => navigation.push("add_balance")}
                                    activeOpacity={0.7}
                                    style={{
                                        padding: 7,
                                        borderWidth: 1,
                                        borderColor: "green",
                                        borderRadius: 10,
                                        marginTop: 6,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        Isi Wallet
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.push("transaction_history")}
                                    activeOpacity={0.7}
                                    style={{
                                        padding: 7,
                                        borderWidth: 1,
                                        borderColor: "green",
                                        borderRadius: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        Riwayat Transaksi
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
            </View>
        </ScrollView>
    );
};

const TransactionHistory = ({ navigation }) => {

    const barHeight = StatusBar.currentHeight;
    let balance = 1;
    let [data, setData] = useState([]);
    let [wallet, setWallet] = useState(0);

    useEffect(() => {
        fetchTransactionData();
        return () => {
            console.log("cleaned up");
        };
    }, []);

    const fetchTransactionData = async () => {
        await AsyncStorage.getItem("LOGIN_TOKEN", async (err, token) => {
            await fetch("http://192.168.43.178:8000/get/user/transaction/done/" + token, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    console.log(res);
                    if (res.error) {
                        setData([]);
                    } else {
                        setData(res.data || []);
                        setWallet(res.wallet);
                    }
                })
                .catch((error) => {
                    throw new Error(error);
                });

        });
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "white", paddingTop: barHeight }}
        >
            <StatusBar
                barStyle="default"
                backgroundColor="rgba(0,0,0,0.251)"
                animated
                translucent
            />
            <View style={{ padding: 16 }}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.goBack()}
                    style={{ padding: 6 }}
                >
                    <Icon name="arrow-back-outline" size={30} />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 16, flex: 1 }}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        letterSpacing: 0.7,
                        textAlign: "center",
                    }}
                >
                    You have {formatRupiah(String(wallet), "Rp. ")} Wallet
        </Text>
                <View style={{ padding: 10, marginTop: 20 }}>
                    <Text
                        style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 0.5 }}
                    >
                        Riwayat Transaksi akan tampil disini
                        </Text>

                    <View
                        style={{
                            justifyContent: "space-between",
                            flex: 1,
                            marginTop: 10,
                        }}
                    >
                        {data.length === 0 ? (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        letterSpacing: 0.5,
                                        textAlign: "center",
                                        textTransform: "uppercase",
                                        marginVertical: 50,
                                    }}
                                >
                                    -Tidak ada Riwayat Transaksi ditemukan-
                                    </Text>
                            </View>
                        ) : (
                                data.map((v, i) => {
                                    return (
                                        <View
                                            key={i}
                                            style={{
                                                padding: 10,
                                                flexDirection: "column",
                                                height: 200,
                                                borderRadius: 10,
                                                borderWidth: 0.7,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    ID :{" "}
                                                </Text>
                                                <Text>
                                                    {v.id}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Kode Unik :{" "}
                                                </Text>
                                                <Text>{v.reference_id}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Status :{" "}
                                                </Text>
                                                <Text>
                                                    {v.status ? "sudah di verifikasi" : "belum di verifikasi"}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Tanggal :{" "}
                                                </Text>
                                                <Text>
                                                    {v.date}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    User Name :{" "}
                                                </Text>
                                                <Text>
                                                    {v.courier_id.fullname}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Nominal Top up :{" "}
                                                </Text>
                                                <Text>
                                                    {formatRupiah(String(v.amount), "Rp. ")},-
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Bukti Transfer :{" "}
                                                </Text>
                                                <TouchableOpacity
                                                    style={{
                                                        padding: 6,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderWidth: 1,
                                                        borderColor: "blue",
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 17,
                                                            fontWeight: "bold",
                                                            letterSpacing: 0.5,
                                                        }}
                                                    >
                                                        LIHAT
                                                        </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                }))
                        }
                        <TouchableOpacity
                            onPress={() => navigation.push("add_balance")}
                            activeOpacity={0.7}
                            style={{
                                padding: 7,
                                borderWidth: 1,
                                borderColor: "green",
                                borderRadius: 10,
                                marginTop: 6,
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 20,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    letterSpacing: 0.5,
                                }}
                            >
                                Isi Wallet
                                    </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const AddBalanceForm = ({ navigation }) => {
    let [loginToken, setLoginToken] = useState('');
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem("LOGIN_TOKEN", (_err, res) => {
            setLoginToken(res);
            setLoading(false);
        });
    }, []);

    const barHeight = StatusBar.currentHeight;
    const { width, height } = Dimensions.get("window");
    let [imageSrc, setImageSrc] = useState('');
    let [buktiTf, setBuktiTf] = useState('');
    let [buktiTfType, setBuktiTfType] = useState('');
    let [isErrorWhenSubmitting, setIsErrorWhenSubmitting] = useState(false);

    const options = {
        mediaType: "photo",
        quality: 1.0,
        storageOptions: {
            skipBackup: true,
        },
    };

    const openGallery = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton);
            } else {
                const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setImageSrc(source);

                setBuktiTf(response);
                setBuktiTfType(response.type);
            }
        });
    };

    const openCamera = () => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton);
            } else {
                const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setImageSrc(source);
                setBuktiTf(response);
                setBuktiTfType(response.type);
            }
        });
    };

    const rand = Math.floor(Math.random() * 899 + 100);

    const submitForm = async () => {
        let token = Math.random() * 9999 + 'abcd';
        console.log(buktiTf.data);
        await RNFetchBlob.fetch(
            'POST',
            'http://192.168.43.178:8000/request/add/balance',
            {
                Authorization: 'Bearer' + token,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            [
                {
                    name: 'token',
                    data: String(loginToken),
                },
                {
                    name: 'ref',
                    data: String(rand),
                },
                {
                    name: 'buktiTransfer',
                    filename: `bukti-transfer-${token}-${Math.round(Math.random() * 9999)}.jpg`,
                    data: buktiTf.data,
                    type: buktiTfType,
                },
            ]
        )
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                if (res.error) {
                    setIsErrorWhenSubmitting(true);
                }
                return navigation.push("courier_balance");
            })
            .catch((err) => {
                console.log("ini error ", err);
            });
    };
    return loginToken !== 0 ? (
        <ScrollView
            style={{ flex: 1, backgroundColor: "white", paddingTop: barHeight }}
        >
            <StatusBar
                barStyle="default"
                backgroundColor="rgba(0,0,0,0.251)"
                animated
                translucent
            />
            <View style={{ padding: 16 }}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate('courier_balance')}
                    style={{ padding: 6 }}
                >
                    <Icon name="arrow-back-outline" size={30} />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 16, flex: 1, alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 17, letterSpacing: 0.5 }}>
                    Form isi Wallet
        </Text>

                <View style={{ marginTop: 20, flex: 1 }}>
                    <View style={{ padding: 10, marginBottom: 5 }}>
                        <Text
                            style={{ fontWeight: "bold", fontSize: 15, letterSpacing: 0.5 }}
                        >
                            No. Rek Ongqir : 12376172367123
            </Text>
                        <Text
                            style={{ fontWeight: "bold", fontSize: 15, letterSpacing: 0.5 }}
                        >
                            BCA | Atas Nama : Mada Nugraha
            </Text>
                    </View>
                    <View style={{ padding: 10, marginBottom: 5 }}>
                        <Text
                            style={{ fontWeight: "bold", fontSize: 15, letterSpacing: 0.5 }}
                        >
                            Kode Unik : {rand}
                        </Text>
                        <Text
                            style={{ fontWeight: "bold", fontSize: 15, letterSpacing: 0.5 }}
                        >
                            *Gunakan kode ini di 3 angka belakang nominal kamu transaksi ATM.
              Cth : Rp. 50.{rand}{" "}
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 17,
                            letterSpacing: 0.5,
                            marginBottom: 10,
                        }}
                    >
                        Kirim Bukti Transfer
          </Text>
                    <TouchableOpacity
                        onPress={() => openGallery()}
                        style={{
                            padding: 10,
                            borderWidth: 1,
                            borderColor: "blue",
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 17,
                                letterSpacing: 0.6,
                                marginRight: 10,
                            }}
                        >
                            Import from Gallery
            </Text>
                        <Icon name="images-outline" size={30} />
                    </TouchableOpacity>
                    <View
                        style={{
                            padding: 20,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text>---- OR ----</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => openCamera()}
                        style={{
                            padding: 10,
                            borderWidth: 1,
                            borderColor: "blue",
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 17,
                                letterSpacing: 0.6,
                                marginRight: 10,
                            }}
                        >
                            Take using Camera
            </Text>
                        <Icon name="camera-outline" size={30} />
                    </TouchableOpacity>

                    <View style={{ padding: 10, marginTop: 10 }}>
                        <Text
                            style={{ fontSize: 15, letterSpacing: 0.5, fontWeight: "bold" }}
                        >
                            OUTPUT
            </Text>

                        <View
                            style={{
                                height: 150,
                                width: 150,
                                borderRadius: 5,
                                marginTop: 6,
                            }}
                        >
                            <Image
                                style={{
                                    alignSelf: "stretch",
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: 5,
                                }}
                                source={imageSrc}
                            />
                        </View>
                        <Text style={{ marginTop: 10 }}>
                            *Notes : the amount u sent us the money , it would be your wallet
                            to get an orders and have to wait until we verified your
                            transaction
            </Text>
                    </View>
                    <TouchableOpacity
                        disabled={buktiTf === "" ? true : false}
                        onPress={() => submitForm()}
                        style={{
                            borderRadius: 7,
                            borderWidth: 0.7,
                            borderColor: buktiTf === "" ? "red" : "blue",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 60,
                            marginTop: 10,
                            marginBottom: 20,
                        }}
                    >
                        <Text
                            style={{ fontWeight: "bold", fontSize: 20, letterSpacing: 0.6 }}
                        >
                            Kirim
            </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    ) : (
            <View
                style={{
                    backgroundColor: "white",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator color="blue" size="large" />
            </View>
        );
};
export { CourierBalance, AddBalanceForm, TransactionHistory };
