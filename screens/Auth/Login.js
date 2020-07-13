import React, { useState } from "react";
import styled from "styled-components/native";
import { TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import AuthInput from "../../components/AuthInput";
import AuthBoutton from "../../components/AuthButton";
import useInput from "../../hooks/useInput";
import { useMutation } from "react-apollo-hooks";
import { LOG_IN } from "./AuthQueries";

const View = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const Text = styled.Text``;

export default ({ navigation }) => {
  const emailInput = useInput("");
  const [loading, setLoading] = useState(false);
  const requestSecretMutation = useMutation(LOG_IN, {
    variables: {
      email: emailInput.value,
    },
  });
  const handleLogin = async () => {
    const { value } = emailInput;
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (value === "") {
      return Alert.alert("Email 입력란이 비어있습니다.");
    } else if (!emailRegex.test(value)) {
      return Alert.alert("정확한 Email을 입력해 주세요.");
    }
    try {
      setLoading(true);
      const {
        data: { requestSecret },
      } = await requestSecretMutation();
      if (requestSecret) {
        Alert.alert("Email을 확인해 주세요.");
        navigation.navigate("Confirm", { email: value });
      } else {
        Alert.alert("가입되지 않은 Email 입니다.");
        navigation.navigate("Signup", { email: value });
      }
    } catch (e) {
      console.log(e);
      Alert.alert("지금은 로그인할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <AuthInput
          {...emailInput}
          placeholder="Email"
          keyboardType="email-address"
          returnKeyType="send"
          onSubmitEditing={handleLogin}
          autoCorrect={false}
        />
        <AuthBoutton loading={loading} onPress={handleLogin} text="로그인" />
      </View>
    </TouchableWithoutFeedback>
  );
};
