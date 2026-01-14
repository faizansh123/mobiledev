import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Modal,
} from "react-native";

import { addMeal } from "./two";
import { useTodaysMeals } from "./todaysfood";
import { deleteMeal } from "./remove";
import { updateMeal } from "./edit"; 

const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

export default function FoodTrackerScreen() {
  const meals = useTodaysMeals();

  const [foodName, setFoodName] = useState("");
  const [calories, setCalories] = useState("");
  const [mealType, setMealType] = useState("lunch");
  const [error, setError] = useState("");

 
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editFoodName, setEditFoodName] = useState("");
  const [editCalories, setEditCalories] = useState("");
  const [editMealType, setEditMealType] = useState("lunch");
  const [editError, setEditError] = useState("");

  const onSave = async () => {
    setError("");

    if (!foodName.trim()) return setError("Enter a food name");
    if (!calories || isNaN(Number(calories))) return setError("Enter valid calories");

    try {
      await addMeal({ foodName, calories, mealType });
      setFoodName("");
      setCalories("");
    } catch (e) {
      setError(e.message || "Failed to save meal");
    }
  };

  const openEdit = (item) => {
    setEditError("");
    setEditId(item.id);
    setEditFoodName(item.foodName ?? "");
    setEditCalories(String(item.calories ?? ""));
    setEditMealType(item.mealType ?? "lunch");
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditId(null);
  };

  const onEditSave = async () => {
    setEditError("");

    if (!editFoodName.trim()) return setEditError("Enter a food name");
    if (!editCalories || isNaN(Number(editCalories))) return setEditError("Enter valid calories");
    if (!editId) return setEditError("Missing meal id");

    try {
      await updateMeal(editId, {
        foodName: editFoodName,
        calories: editCalories,
        mealType: editMealType,
      });
      closeEdit();
    } catch (e) {
      setEditError(e.message || "Failed to update meal");
    }
  };
  const totalCalories = meals.reduce(
  (sum, meal) => sum + (meal.calories || 0),
  0
);

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Add Meal</Text>

      <TextInput
        placeholder="Food name (e.g., Chicken wrap)"
        value={foodName}
        onChangeText={setFoodName}
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
      />

      <TextInput
        placeholder="Calories (e.g., 450)"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
        style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
      />

      <Text style={{ fontWeight: "600" }}>Meal type</Text>
      <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
        {MEAL_TYPES.map((t) => (
          <Pressable
            key={t}
            onPress={() => setMealType(t)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderRadius: 999,
              backgroundColor: mealType === t ? "#ddd" : "transparent",
            }}
          >
            <Text>{t}</Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Pressable
        onPress={onSave}
        style={{
          padding: 14,
          borderRadius: 12,
          borderWidth: 1,
          alignItems: "center",
        }}
      >
        <Text style={{ fontWeight: "700" }}>Save Meal</Text>
      </Pressable>

      <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontWeight: "700" }}>Total Cals</Text>
              <Text>
                {totalCalories} cal
              </Text>
            </View>

        <View
      style={{
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
      }}
    >
    <Text style={{ fontSize: 14 }}>Total Calories Today</Text>
    <Text style={{ fontSize: 28, fontWeight: "700" }}>
      {totalCalories} kcal
    </Text>
  </View>


      <FlatList
        data={meals}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              padding: 12,
              borderRadius: 12,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ fontWeight: "700" }}>{item.foodName}</Text>
              <Text>
                {item.mealType} • {item.calories} cal
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
             
              <Pressable
                onPress={() => openEdit(item)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "green", fontWeight: "700" }}>Edit</Text>
              </Pressable>

              <Pressable
                onPress={() => deleteMeal(item.id)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderWidth: 1,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: "red", fontWeight: "700" }}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No meals logged today.</Text>}
      />

      
      <Modal visible={editOpen} transparent animationType="fade" onRequestClose={closeEdit}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              gap: 12,
              borderWidth: 1,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700" }}>Edit Meal</Text>

            <TextInput
              placeholder="Food name"
              value={editFoodName}
              onChangeText={setEditFoodName}
              style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
            />

            <TextInput
              placeholder="Calories"
              value={editCalories}
              onChangeText={setEditCalories}
              keyboardType="numeric"
              style={{ borderWidth: 1, padding: 12, borderRadius: 10 }}
            />

            <Text style={{ fontWeight: "600" }}>Meal type</Text>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              {MEAL_TYPES.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setEditMealType(t)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderWidth: 1,
                    borderRadius: 999,
                    backgroundColor: editMealType === t ? "#ddd" : "transparent",
                  }}
                >
                  <Text>{t}</Text>
                </Pressable>
              ))}
            </View>

            {editError ? <Text style={{ color: "red" }}>{editError}</Text> : null}

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
              <Pressable onPress={closeEdit} style={{ paddingVertical: 10, paddingHorizontal: 12 }}>
                <Text>Cancel</Text>
              </Pressable>

              <Pressable
                onPress={onEditSave}
                style={{ paddingVertical: 10, paddingHorizontal: 12 }}
              >
                <Text style={{ fontWeight: "700" }}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
