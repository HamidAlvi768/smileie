No, the `edit-patient-modal` is **not** nested under the `info-section`.

From the image, here’s the relevant breakdown:

---

### `info-section` Hierarchy:

```html
<div class="container-fluid">
  <div class="row">
    <div class="col-md-8 col-lg-8">
      <div class="info-section">
        ...
      </div>
    </div>
  </div>
</div>
```

### `edit-patient-modal` Hierarchy:

```html
<svg id="SvgjsSvg1001" ...></svg>
<div tabindex="-1" style="...">
  <div class="modal fade show" ...>
    <div class="modal-dialog edit-patient-modal modal-lg" ...>
      ...
    </div>
  </div>
</div>
```

---

### Conclusion:

* ✅ `info-section` is inside the **main layout** content grid.
* ❌ `edit-patient-modal` is **outside** of the layout structure, at the **same level or higher** in the DOM tree as `#root`.

This is expected behavior for modals in frameworks like Bootstrap — they are appended to the **body** or outside the main app wrapper to ensure correct z-index stacking and isolation from layout constraints.

Let me know if you want to programmatically move or scope the modal differently.
